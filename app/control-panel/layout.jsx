"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../_lib/supabase';

export default function ControlPanelLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUser(session.user);
      } else if (pathname !== '/control-panel/login') {
        router.push('/control-panel/login');
      }
      setLoading(false);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && pathname !== '/control-panel/login') {
        router.push('/control-panel/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/control-panel/login');
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p>Memuat...</p>
        </div>
    );
  }

  // Jangan tampilkan layout di halaman login
  if (pathname === '/control-panel/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Admin Control Panel</h1>
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}