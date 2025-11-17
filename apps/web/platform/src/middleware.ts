import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/about', '/contact', '/pricing'];
const privateRoutes = ['/dashboard', '/store'];

function normalizePathname(pathname: string) {
  if (pathname !== '/' && pathname.endsWith('/'))
    pathname = pathname.slice(0, -1);
  return pathname.toLowerCase();
}

export async function middleware(request: NextRequest) {
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const token = session?.access_token;
  const pathname = normalizePathname(request.nextUrl.pathname);
  // console.log(token);
  const isPrivate = privateRoutes.some((path) => pathname.startsWith(path));
  const isPublic = publicRoutes.some(
    (path) => pathname === '/' || pathname.startsWith(path)
  );
  if (isPrivate) {
    if (token) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  if (isPublic) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.next();
    }
  }
  return NextResponse.error();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */ '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
