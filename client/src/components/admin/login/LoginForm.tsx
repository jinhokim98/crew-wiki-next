'use client';

import {useRouter} from 'next/navigation';
import {useState} from 'react';

export default function LoginForm() {
  const [adminForm, setAdminForm] = useState({
    loginId: '',
    password: '',
  });

  const [isValid, setIsValid] = useState({
    loginId: false,
    password: false,
  });

  const router = useRouter();

  const loginIdRegex = /^(?=.*[a-zA-Z가-힣]).{4,20}$/;
  const passwordRegex = /^(?=.*[a-zA-Z가-힣])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setAdminForm(prev => ({...prev, [name]: value}));

    if (name === 'loginId') {
      setIsValid(prev => ({...prev, loginId: loginIdRegex.test(value)}));
    } else if (name === 'password') {
      setIsValid(prev => ({...prev, password: passwordRegex.test(value)}));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginIdRegex.test(adminForm.loginId)) {
      alert('아이디는 4~20자이며, 문자(영문자 또는 한글)를 반드시 포함해야 합니다.');
      return;
    }
    if (!passwordRegex.test(adminForm.password)) {
      alert('비밀번호는 8자 이상이며, 문자(영문자 또는 한글), 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.');
      return;
    }

    try {
      await fetch('/api/post-admin-login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(adminForm),
      });

      router.replace('/admin/documents');
    } catch (error) {
      if (error instanceof Error) {
        console.error('로그인 중 오류 발생:', error.message);
      }
    }
  };

  return (
    <div className="w-[80%] max-w-lg rounded-lg bg-primary-200 px-8 py-10 shadow-lg md:w-full">
      <h2 className="mb-6 text-2xl font-bold text-white">관리자 로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="loginId" className="mb-2 block text-sm font-medium">
            아이디
          </label>
          <input
            type="text"
            id="loginId"
            name="loginId"
            value={adminForm.loginId}
            onChange={handleInputChange}
            className={`w-full rounded border px-3 py-2 text-black focus:outline-none focus:ring focus:ring-primary-500 ${adminForm.loginId && !isValid.loginId ? 'border-red-500' : ''}`}
            placeholder="아이디를 입력하세요"
            autoComplete="off"
          />
          {adminForm.loginId && !isValid.loginId && (
            <p className="mt-1 text-sm text-red-600">
              아이디는 4~20자이며, 문자(영문자 또는 한글)를 반드시 포함해야 합니다.
            </p>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={adminForm.password}
            onChange={handleInputChange}
            className={`w-full rounded border px-3 py-2 text-black focus:outline-none focus:ring focus:ring-primary-500 ${adminForm.password && !isValid.password ? 'border-red-500' : ''}`}
            placeholder="비밀번호를 입력하세요"
            autoComplete="off"
          />
          {adminForm.password && !isValid.password && (
            <p className="mt-1 text-sm text-red-600">
              비밀번호는 8자 이상이며, 문자(영문자 또는 한글), 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full rounded bg-primary-400 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-primary-700 focus:outline-none focus:ring focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-gray-300"
          disabled={!isValid.loginId || !isValid.password}
        >
          로그인
        </button>
      </form>
    </div>
  );
}
