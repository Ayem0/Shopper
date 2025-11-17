import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token?.access_token) {
    console.log('NO TOKEN');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const url = `${
    process.env.BACKEND_URL
  }/?${request.nextUrl.searchParams.toString()}`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.access_token}`,
      },
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


export async function POST(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token?.access_token) {
    console.log('NO TOKEN');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const url = `${
    process.env.BACKEND_URL
  }/`;
  try {
    const body = await request.json();
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.access_token}`,
      },
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