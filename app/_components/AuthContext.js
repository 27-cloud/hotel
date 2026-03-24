// 'use client';
// import { createContext, useContext, useEffect, useState } from 'react';
// import { supabase } from '../_lib/supabase';

// const AuthContext = createContext();
// // {
// //   data: {
// //     session: {
// //       user: {
// //         id: "abc-123",
// //         email: "user@example.com"
// //       },
// //       access_token: "xxx"
// //     }
// //   }
// // }

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // 获取当前登录状态
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     // 监听登录/登出状态变化
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setUser(session?.user ?? null);
//         setLoading(false);
//       }
//     );

//     return () => subscription.unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading,setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// }

'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../_lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: useEffect 开始执行');
    
    // 获取当前登录状态
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('getSession 完成, session:', session?.user?.email);
      setUser(session?.user ?? null);
      setLoading(false);
      console.log('loading 设置为 false');
    }).catch(err => {
      console.error('getSession 错误:', err);
      setLoading(false);
    });

    // 监听登录/登出状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log('onAuthStateChange 触发, event:', _event, 'user:', session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      console.log('AuthProvider: 清理监听器');
      subscription.unsubscribe();
    };
  }, []);

  console.log('AuthProvider: 渲染, loading:', loading, 'user:', user?.email);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}