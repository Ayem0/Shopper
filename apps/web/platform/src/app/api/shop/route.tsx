import { proxyQuery } from '@/lib/proxy/proxy-query';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return proxyQuery({
    request,
    method: 'GET',
    path: `http://localhost:3001/shops?${request.nextUrl.searchParams.toString()}`,
  });
}

export async function POST(request: NextRequest) {
  return proxyQuery({
    request,
    method: 'POST',
    path: 'http://localhost:3001/shops',
    body: await request.json(),
  });
}
