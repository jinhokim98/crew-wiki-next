'use server';

import {ENDPOINT} from '@constants/endpoint';
import {AdminLogin} from '@type/Admin.type';

export const postAdminLogin = async ({loginId, password}: AdminLogin) => {
  // 현제는 임시 백엔드 base URL이므로 추후 .env 파일의 실제 base URL로 변경 예정
  const response = await fetch(`http://15.164.102.15:8080${ENDPOINT.postAdminLogin}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({loginId, password}),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('로그인 요청 실패');
  }

  return response;
};
