// app/_components/SignUpForm.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../_lib/supabase';
import InputForm from './InputForm';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    if (error) {
      setError(error.message);
    } else {
      alert('注册成功！请登录');
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-10 mt-10 items-center">
      <h2 className="text-3xl font-semibold">
        Create an account
      </h2>

      <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-80">
        <InputForm 
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  handleChange={setFullName}/>
        <InputForm 
                  type="email"
                  placeholder="Email address"
                  value={email}
                  handleChange={setEmail}/>
        <InputForm 
                  type="password"
                  placeholder="Password"
                  value={password}
                  handleChange={setPassword}/>
    
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="bg-accent-500
           text-primary-800 px-4 py-2 
           rounded-md hover:bg-accent-600 
           disabled:opacity-50"
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
      </form>
    </div>
  );
}