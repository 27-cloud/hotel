"use client"
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { useAuth } from './AuthContext';
import { supabase } from '../_lib/supabase';
import { useRouter } from 'next/navigation';

function SignOutButton() {
  const { setUser } = useAuth();
  const router = useRouter();

  const handleClick = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.replace('/login');
  };

  return (
    <button className='py-3 px-5 hover:bg-primary-900
     hover:text-primary-100 transition-colors 
     flex items-center gap-4 font-semibold
      text-primary-200 w-full' onClick={handleClick}>
      <ArrowRightOnRectangleIcon className='h-5 w-5 text-primary-600' />
      <span>Sign out</span>
    </button>
  );
}

export default SignOutButton;
