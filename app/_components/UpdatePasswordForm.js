'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../_lib/supabase';
import { useAuth } from './AuthContext';  // ✅ 添加这行

export default function UpdatePasswordForm() {
  const { user, loading: authLoading } = useAuth();  // ✅ 获取 loading 状态
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 检查用户是否登录
  useEffect(() => {
    if (!authLoading && !user) {
      setError('Please log in to change your password');
    }
  }, [user, authLoading]);

  async function handleSubmit(e) {
  e.preventDefault();
  setError('');
  setSuccess('');

  // 先检查 session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  console.log('当前 session:', session?.user?.email);
  console.log('session 是否有效:', !!session);
  
  if (sessionError) {
    console.error('Session error:', sessionError);
  }
  
  if (!session) {
    setError('Your session has expired. Please log in again.');
    return;
  }

  if (newPassword.length < 8) {
    setError('Password must be at least 8 characters.');
    return;
  }

  if (newPassword !== confirmPassword) {
    setError('Passwords do not match.');
    return;
  }

  setLoading(true);
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    console.error('Update error details:', updateError);
    setError(updateError.message);
  } else {
    setSuccess('Password updated successfully.');
    setNewPassword('');
    setConfirmPassword('');
  }
  setLoading(false);
}

  // 正在加载认证状态
  if (authLoading) {
    return (
      <div className="bg-primary-900 py-8 px-12 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  // 未登录
  if (!user) {
    return (
      <div className="bg-primary-900 py-8 px-12 text-center">
        <p className="text-red-400">Please log in to change your password.</p>
        <a href="/login" className="text-accent-500 underline mt-2 inline-block">
          Go to login
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col max-w-2xl"
    >
      <div className="space-y-2">
        <label htmlFor="new-password">New password</label>
        <input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirm-password">Confirm password</label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          disabled={loading}
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-green-400 text-sm">{success}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
        >
          {loading ? 'Updating...' : 'Update password'}
        </button>
      </div>
    </form>
  );
}