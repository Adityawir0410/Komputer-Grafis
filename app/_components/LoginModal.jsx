"use client";
import { useState } from 'react';
import { useAuth } from '../_context/AuthContext';
import { toast } from 'react-toastify';

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMode, setLoginMode] = useState('ub'); // 'ub' or 'dummy'
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.warning('Mohon isi username dan password');
      return;
    }

    // Untuk akun dummy, kirim flag isDummy = true
    const isDummy = loginMode === 'dummy';
    const result = await login(username, password, isDummy);
    
    if (result.success) {
      setUsername('');
      setPassword('');
      onSuccess();
      onClose();
    }
  };

  const handleModeChange = (mode) => {
    setLoginMode(mode);
    // Set default values untuk akun testing
    if (mode === 'dummy') {
      setUsername('123456789');
      setPassword('testing123');
    } else {
      setUsername('');
      setPassword('');
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setUsername('');
      setPassword('');
      setLoginMode('ub');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-6 w-full max-w-md mx-4 transform transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {loginMode === 'ub' ? 'Login SSO Universitas Brawijaya' : 'Login Akun Testing'}
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Login Mode Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => handleModeChange('ub')}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              loginMode === 'ub'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Akun UB
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('dummy')}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              loginMode === 'dummy'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Akun Testing
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-black mb-1">
              NIM
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={loginMode === 'ub' ? 'Masukkan NIM Anda' : '123456789'}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={loginMode === 'ub' ? 'Masukkan Password Anda' : 'testing123'}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-black"
              required
            />
          </div>

          {loginMode === 'dummy' && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-xs text-green-700">
                <span className="font-semibold">💡 Info:</span> Gunakan NIM <span className="font-mono bg-green-100 px-1 rounded">123456789</span> dan password <span className="font-mono bg-green-100 px-1 rounded">testing123</span> atau ubah sesuai kebutuhan testing Anda
              </p>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || !username.trim() || !password.trim()}
              className={`w-full ${
                loginMode === 'ub' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              } text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memverifikasi...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            {loginMode === 'ub' ? 'Gunakan NIM dan password UB' : 'Akun testing untuk keperluan development'}
          </p>
        </div>
      </div>
    </div>
  );
}
