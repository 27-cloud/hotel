"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../_components/AuthContext";
import { useEffect } from "react";
import Spinner from "./Spinner";

export default function PageProtected({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // 正在加载或没有用户时，都不显示内容
  if (loading || !user) {
    return <Spinner />;
  }

  return <>{children}</>;
}