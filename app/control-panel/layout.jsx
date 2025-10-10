// File: app/control-panel/layout.jsx

"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../_lib/supabase';
// import { ToastContainer } from 'react-toastify'; // ✅ Hapus import ini
import { Shield, Loader2, LogOut } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

export default function ControlPanelLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let unsub = null;
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setLoading(false);
      } else if (pathname !== '/control-panel/login') {
        setUser(null);
        // Delay sebelum set loading false untuk memastikan redirect terjadi
        router.replace('/control-panel/login');
        // Tetap loading sampai redirect selesai
        setTimeout(() => setLoading(false), 100);
      } else {
        setLoading(false);
      }
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && pathname !== '/control-panel/login') {
        setUser(null);
        router.replace('/control-panel/login');
      } else if (session) {
        setUser(session.user);
      }
    });
    unsub = authListener.subscription.unsubscribe;
    return () => {
      if (unsub) unsub();
    };
  }, [router, pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/control-panel/login');
  };

  if (loading) {
    // Prevent any UI flash until auth check is done
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Jangan tampilkan layout di halaman login
  if (pathname === '/control-panel/login') {
    return (
      // ✅ Tidak ada ToastContainer di sini
      <>
        {children}
      </>
    );
  }

  // Double check: jika user tidak ada dan bukan di halaman login, jangan render apapun
  if (!user && pathname !== '/control-panel/login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    // ✅ Tidak ada ToastContainer di sini
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Control Panel</h1>
              <p className="text-sm text-gray-500">CleanScape VR Management</p>
            </div>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}