import {NextResponse} from 'next/server';
import {postAdminLogin} from '@apis/admin';
import {cookies} from 'next/headers';

export const POST = async (request: Request) => {
  try {
    const {loginId, password} = await request.json();

    if (!loginId || !password) {
      return NextResponse.json({error: 'Login ID 또는 password가 존재하지 않습니다.'}, {status: 400});
    }

    const response = await postAdminLogin({loginId, password});

    if (!response.ok) {
      return NextResponse.json({error: '로그인 실패'}, {status: 401});
    }

    const setCookieHeader = response.headers.get('set-cookie');

    if (!setCookieHeader) {
      return NextResponse.json({error: '로그인 토큰이 없습니다.'}, {status: 401});
    }

    const [tokenKey, rest] = setCookieHeader.split('=');
    const tokenValue = rest?.split(';')[0];

    if (!tokenKey || !tokenValue) {
      return NextResponse.json({error: '로그인 토큰이 유효하지 않습니다.'}, {status: 401});
    }

    const cookieStore = await cookies();
    cookieStore.set({
      name: tokenKey.trim(),
      value: tokenValue.split(';')[0].trim(),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    return NextResponse.json({message: '로그인 성공'});
  } catch (error) {
    console.error('로그인 처리 중 서버 오류:', error);
    return NextResponse.json({error: '로그인 처리 중 오류'}, {status: 500});
  }
};
