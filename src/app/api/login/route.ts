import { NextRequest, NextResponse } from 'next/server';

const TARGET_API_URL = 'https://portal.stmik-time.ac.id/rest/api/login';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, captchaToken } = body;

    // Verifikasi reCAPTCHA v2 dengan Google API
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (secretKey) {
      if (!captchaToken) {
        return NextResponse.json(
          {
            success: false,
            message: 'Verifikasi keamanan (reCAPTCHA) wajib diselesaikan.',
          },
          { status: 400 }
        );
      }

      try {
        const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            secret: secretKey,
            response: captchaToken,
          }),
        });

        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          return NextResponse.json(
            {
              success: false,
              message: 'Verifikasi reCAPTCHA gagal atau telah kadaluwarsa. Silakan coba lagi.',
              errorCodes: verifyData['error-codes'],
            },
            { status: 400 }
          );
        }
      } catch (captchaErr) {
        console.error('reCAPTCHA verification error:', captchaErr);
        return NextResponse.json(
          {
            success: false,
            message: 'Gagal melakukan verifikasi keamanan dengan server Google.',
          },
          { status: 500 }
        );
      }
    }

    // Strictly send only username and password to match backend dto.LoginDto
    const payload = {
      username,
      password,
    };

    // Forward request to external STMIK TIME login API
    const response = await fetch(TARGET_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const textData = await response.text();
      try {
        data = JSON.parse(textData);
      } catch {
        data = { message: textData || 'Respon diterima dari server.' };
      }
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Login proxy error:', err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Gagal menghubungi server portal.stmik-time.ac.id',
      },
      { status: 500 }
    );
  }
}
