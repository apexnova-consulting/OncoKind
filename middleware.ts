import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { readAalFromAccessToken } from '@/lib/auth-security';

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  const pathname = request.nextUrl.pathname;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const requiresDashboardMfa =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/journey') ||
    pathname.startsWith('/quiet-room') ||
    pathname.startsWith('/admin');
  if (user && requiresDashboardMfa) {
    const [
      {
        data: { session },
      },
      { data: profile },
    ] = await Promise.all([
      supabase.auth.getSession(),
      supabase.from('profiles').select('mfa_enabled').eq('id', user.id).maybeSingle(),
    ]);

    const aal = readAalFromAccessToken(session?.access_token);
    if (profile?.mfa_enabled && aal !== 'aal2') {
      const url = request.nextUrl.clone();
      url.pathname = '/mfa';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
