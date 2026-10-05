import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Logo STMIK TIME lengkap dengan teks horizontal dari public/img/STMIK TIME HORIZONTAL.png
 */
export function StmikTimeLogo({ className = 'h-10 md:h-11 w-auto', width = 220, height = 55 }: LogoProps) {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <Image
        src="/img/STMIK TIME HORIZONTAL.png"
        alt="STMIK TIME - Teknologi Informasi Manajemen & Edukasi"
        width={width}
        height={height}
        priority
        className="h-full w-auto object-contain"
      />
    </div>
  );
}

/**
 * Logo Lambang STMIK TIME tanpa teks dari public/img/Logo.png
 */
export function StmikLogoOnly({ className = 'h-10 w-10', width = 120, height = 120 }: LogoProps) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <Image
        src="/img/Logo.png"
        alt="Lambang STMIK TIME"
        width={width}
        height={height}
        priority
        className="h-full w-auto object-contain"
      />
    </div>
  );
}

/**
 * Watermark lambang STMIK TIME tanpa teks untuk background panel
 */
export function StmikWatermark({
  className = 'w-full h-full',
  opacity = 'opacity-10',
}: {
  className?: string;
  opacity?: string;
}) {
  return (
    <div className={`relative pointer-events-none select-none ${className}`}>
      <Image
        src="/img/Logo.png"
        alt="STMIK TIME Watermark"
        width={400}
        height={400}
        className={`w-full h-full object-contain ${opacity}`}
      />
    </div>
  );
}
