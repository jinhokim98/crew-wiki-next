'use client';

import Button from '@components/common/Button';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

export default function LoginForm() {
  const [adminForm, setAdminForm] = useState({
    loginId: '',
    password: '',
  });

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setAdminForm(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
          <label htmlFor="adminId" className="mb-2 block text-sm font-medium">
            아이디
          </label>
          <input
            type="text"
            id="adminId"
            name="loginId"
            value={adminForm.loginId}
            onChange={handleInputChange}
            className="w-full rounded border px-3 py-2 text-black focus:outline-none focus:ring focus:ring-primary-500"
            placeholder="아이디를 입력하세요"
            autoComplete="username"
          />
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
            className="w-full rounded border px-3 py-2 text-black focus:outline-none focus:ring focus:ring-primary-500"
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-primary-400 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-primary-700 focus:outline-none focus:ring focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-gray-300"
          disabled={!adminForm.loginId || !adminForm.password}
        >
          로그인
        </button>
      </form>
    </div>
  );
}
