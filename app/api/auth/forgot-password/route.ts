import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const GENERIC_SUCCESS =
  'If an account exists for that email, we just sent a reset link. Please check your inbox and spam folder.';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address so we can send you a reset link.' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Password reset is temporarily unavailable. Please try again in a few minutes.' },
        { status: 503 }
      );
    }

    const response = NextResponse.json({ ok: true, message: GENERIC_SUCCESS });
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
          );
        },
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/callback?next=/reset-password`,
    });

    if (error) {
      console.error('[forgot-password]', error.message);
    }

    // Always return the same success copy so we do not reveal whether the email is registered.
    return response;
  } catch (e) {
    console.error('[forgot-password]', e);
    return NextResponse.json(
      { error: 'We could not send a reset email just now. Please try again in a few minutes.' },
      { status: 500 }
    );
  }
}
