"use client";
import { useAuth } from '../_context/AuthContext';

export default function UserProfile() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Profil Pengguna</h3>
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          Logout
        </button>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-500">NIM</label>
          <p className="text-gray-900">{user.nim}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
          <p className="text-gray-900">{user.fullName}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-500">Fakultas</label>
          <p className="text-gray-900">{user.fakultas}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-500">Program Studi</label>
          <p className="text-gray-900">{user.programStudi}</p>
        </div>
      </div>
    </div>
  );
}
