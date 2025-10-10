"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = Cookies.get('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        Cookies.remove('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password, isDummy = false) => {
    setIsLoading(true);
    
    try {
      // Handle dummy login
      if (isDummy) {
        // Validasi kredensial dummy
        if (username === '123456789' && password === 'testing123') {
          const dummyUserData = {
            nim: '123456789',
            fullName: 'Testing',
            email: 'testing@example.com',
            fakultas: 'Testing',
            programStudi: 'Testing',
            loginTime: new Date().toISOString(),
            isDummy: true
          };
          
          setUser(dummyUserData);
          Cookies.set('user', JSON.stringify(dummyUserData), { expires: 1 });
          
          toast.success(`Selamat datang, ${dummyUserData.fullName}! (Akun Testing)`);
          
          return { success: true };
        } else {
          toast.error('NIM atau Password akun testing salah!');
          return { success: false, message: 'Invalid dummy credentials' };
        }
      }

      // Handle normal login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userData = {
          nim: data.user.nim,
          fullName: data.user.fullName,
          email: data.user.email,
          fakultas: data.user.fakultas,
          programStudi: data.user.programStudi,
          loginTime: new Date().toISOString(),
          isDummy: false
        };
        
        setUser(userData);
        Cookies.set('user', JSON.stringify(userData), { expires: 1 }); // Expires in 1 day
        
        toast.success(`Selamat datang, ${data.user.fullName}!`);
        
        return { success: true };
      } else {
        toast.error(data.message || 'Login gagal');
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Terjadi kesalahan saat login');
      return { success: false, message: 'Network error' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('user');
    toast.success('Berhasil logout');
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
