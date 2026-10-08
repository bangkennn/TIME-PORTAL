'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

declare global {
  interface Window {
    grecaptcha?: {
      ready?: (callback: () => void) => void;
      render?: (
        container: HTMLElement | string,
        parameters: {
          sitekey: string;
          theme?: 'light' | 'dark';
          size?: 'normal' | 'compact';
          tabindex?: number;
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        }
      ) => number;
      reset?: (opt_widget_id?: number) => void;
      getResponse?: (opt_widget_id?: number) => string;
    };
  }
}

export interface RecaptchaV2Ref {
  reset: () => void;
  getResponse: () => string;
}

interface RecaptchaV2Props {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  theme?: 'light' | 'dark';
  siteKey?: string;
  className?: string;
}

export const RecaptchaV2 = forwardRef<RecaptchaV2Ref, RecaptchaV2Props>(function RecaptchaV2(
  { onVerify, onExpire, onError, theme = 'light', siteKey, className = '' },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
    onErrorRef.current = onError;
  });

  const activeSiteKey = siteKey || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetIdRef.current !== null && typeof window.grecaptcha?.reset === 'function') {
        window.grecaptcha.reset(widgetIdRef.current);
      }
    },
    getResponse: () => {
      if (widgetIdRef.current !== null && typeof window.grecaptcha?.getResponse === 'function') {
        return window.grecaptcha.getResponse(widgetIdRef.current) || '';
      }
      return '';
    },
  }));

  useEffect(() => {
    if (!activeSiteKey) {
      console.warn('reCAPTCHA siteKey is missing.');
      return;
    }

    let isCancelled = false;

    const renderWidget = () => {
      if (isCancelled || !containerRef.current || typeof window.grecaptcha?.render !== 'function') return;
      if (widgetIdRef.current !== null) return; // already rendered

      try {
        const id = window.grecaptcha.render(containerRef.current, {
          sitekey: activeSiteKey,
          theme,
          callback: (token: string) => {
            onVerifyRef.current?.(token);
          },
          'expired-callback': () => {
            onExpireRef.current?.();
          },
          'error-callback': () => {
            onErrorRef.current?.();
          },
        });
        widgetIdRef.current = id;
      } catch (err) {
        console.error('Error rendering reCAPTCHA:', err);
      }
    };

    const SCRIPT_ID = 'recaptcha-v2-script';
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const grecaptcha = window.grecaptcha;
    const hasRender = typeof grecaptcha?.render === 'function';

    if (hasRender) {
      if (typeof grecaptcha?.ready === 'function') {
        grecaptcha.ready(renderWidget);
      } else {
        renderWidget();
      }
    } else {
      const interval = setInterval(() => {
        const currentGrecaptcha = window.grecaptcha;
        if (typeof currentGrecaptcha?.render === 'function') {
          clearInterval(interval);
          if (typeof currentGrecaptcha?.ready === 'function') {
            currentGrecaptcha.ready(renderWidget);
          } else {
            renderWidget();
          }
        }
      }, 100);

      return () => {
        isCancelled = true;
        clearInterval(interval);
      };
    }

    return () => {
      isCancelled = true;
    };
  }, [activeSiteKey, theme]);

  return (
    <div className={`overflow-x-auto min-h-[78px] flex items-center ${className}`}>
      <div ref={containerRef} className="recaptcha-container" />
    </div>
  );
});
