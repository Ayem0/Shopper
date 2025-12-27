import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

interface ProxyQueryParams {
  request: NextRequest;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  body?: unknown;
}

export async function proxyQuery({
  request,
  method,
  path,
  body,
}: ProxyQueryParams) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token?.access_token) {
    console.log('NO TOKEN');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  //   const url = `${process.env.BACKEND_URL}${path}`;
  const url = path;
  try {
    const res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.access_token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const errorBody = await res.json();
      return NextResponse.json(errorBody, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
