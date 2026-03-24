// app/login/page.js
import LoginForm from "../_components/LogInForm";
import Link from "next/link";

export const metadata={
  title:"Login",
}

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-10 mt-10 items-center">
      <LoginForm />
      
      <p className="text-primary-300">
        Don't have an account?{' '}
        <Link href="/signup" className="text-accent-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}