// app/_components/Login.js
'use client';
import { useState } from 'react';
import { supabase } from '../_lib/supabase';
import { useAuth } from '../_context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) setError(error.message);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) setError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <div>
        <p>欢迎, {user.email}</p>
        <button onClick={handleLogout}>登出</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="邮箱"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="密码"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">登录</button>
      <button type="button" onClick={handleSignUp}>注册</button>
    </form>
  );
}