"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../_lib/supabase';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Perubahan 1: Impor diubah

// Komponen Modal Konfirmasi
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-4">
        <h3 className="text-lg font-bold mb-4">Konfirmasi Penghapusan</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            Batal
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState(null);

  const fetchResults = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('tour_results')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setResults(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
    
  useEffect(() => {
    fetchResults();
  }, []);

  const openDeleteModal = (id) => {
    setSelectedResultId(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedResultId(null);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedResultId) return;
    try {
      const response = await fetch(`/api/tour/delete-result/${selectedResultId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Gagal menghapus dari server.');
      fetchResults();
    } catch (err) {
      setError(err.message);
    } finally {
      closeDeleteModal();
    }
  };

  const handleExportExcel = () => {
    if (results.length === 0) return alert("Tidak ada data untuk diekspor.");
    const dataToExport = results.map(res => ({
      'Tanggal': new Date(res.created_at).toLocaleString('id-ID'), 'NIM': res.nim, 'Nama Lengkap': res.full_name, 'Fakultas': res.faculty,
      'Program Studi': res.study_program, 'Total Skor': res.total_score, 'Sisa Waktu (detik)': res.final_time_seconds,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hasil Tur');
    XLSX.writeFile(workbook, 'Hasil_Tur_VR_CleanScape.xlsx');
  };

  const handleExportPdf = () => {
    if (results.length === 0) return alert("Tidak ada data untuk diekspor.");
    const doc = new jsPDF();
    doc.text("Laporan Hasil Tur VR CleanScape", 14, 16);
    
    // Perubahan 2: Pemanggilan fungsi diubah
    autoTable(doc, {
      head: [['Tanggal', 'NIM', 'Nama Lengkap', 'Skor', 'Waktu']],
      body: results.map(res => [
        new Date(res.created_at).toLocaleString('id-ID'),
        res.nim, res.full_name, res.total_score, formatTime(res.final_time_seconds)
      ]),
      startY: 22, theme: 'grid', headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save('Laporan_Hasil_Tur_VR_CleanScape.pdf');
  };

  const formatTime = (seconds) => {
    if (seconds === null || isNaN(seconds)) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="text-center p-4">Memuat data hasil tur...</div>;
  if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">Error: {error}</div>;
  
  return (
    <>
      <ConfirmationModal isOpen={isModalOpen} onClose={closeDeleteModal} onConfirm={handleDelete} message="Apakah Anda yakin ingin menghapus hasil tur ini? Aksi ini tidak dapat dibatalkan."/>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Hasil Tur VR</h2>
          <div className="flex gap-2">
            <button onClick={handleExportExcel} disabled={results.length === 0} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
              Export Excel
            </button>
            <button onClick={handleExportPdf} disabled={results.length === 0} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
              Export PDF
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIM</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sisa Waktu</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.length > 0 ? (
                results.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(res.created_at).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{res.nim}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{res.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">{res.total_score}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-mono">{formatTime(res.final_time_seconds)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => openDeleteModal(res.id)} className="text-red-600 hover:text-red-900 transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    Belum ada data hasil tur yang tersimpan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}