export interface JwtPayload {
  iss?: string;
  upn?: string;
  sub?: string;
  groups?: string[];
  aud?: string;
  iat?: number;
  exp?: number;
  jti?: string;
  [key: string]: unknown;
}

/**
 * Decode JWT token payload safely in browser
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    
    // Replace URL-safe base64 characters
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode base64 to utf-8 string
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}