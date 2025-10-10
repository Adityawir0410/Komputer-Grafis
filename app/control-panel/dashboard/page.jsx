"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../_lib/supabase';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BarChart3, Users, Award, Clock, AlertCircle } from 'lucide-react';
import DeleteConfirmationModal from '../_components/DeleteConfirmationModal';
import ExportButtons from '../_components/ExportButtons';
import DataTable from '../_components/DataTable';

export default function AdminDashboard() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/tour/delete-result/${selectedResultId}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Gagal menghapus dari server.');
      }
      
      await fetchResults();
      toast.success('Data berhasil dihapus!');
    } catch (err) {
      toast.error(err.message || 'Terjadi kesalahan saat menghapus data');
      setError(err.message);
    } finally {
      setDeleteLoading(false);
      closeDeleteModal();
    }
  };

  const handleExportExcel = () => {
    if (results.length === 0) {
      toast.warning("Tidak ada data untuk diekspor.");
      return;
    }

    try {
      const dataToExport = results.map(res => ({
        'Tanggal': new Date(res.created_at).toLocaleString('id-ID'),
        'NIM': res.nim,
        'Nama Lengkap': res.full_name,
        'Fakultas': res.faculty || 'N/A',
        'Program Studi': res.study_program || 'N/A',
        'Total Skor': res.total_score,
        'Sisa Waktu (detik)': res.final_time_seconds,
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Hasil Tur');
      XLSX.writeFile(workbook, `Hasil_Tur_VR_CleanScape_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast.success('Data berhasil diekspor ke Excel!');
    } catch (err) {
      toast.error('Gagal mengekspor data ke Excel');
    }
  };

  const handleExportPdf = () => {
    if (results.length === 0) {
      toast.warning("Tidak ada data untuk diekspor.");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("Laporan Hasil Tur VR CleanScape", 14, 16);
      
      autoTable(doc, {
        head: [['Tanggal', 'NIM', 'Nama Lengkap', 'Fakultas', 'Prodi', 'Skor', 'Waktu']],
        body: results.map(res => [
          new Date(res.created_at).toLocaleString('id-ID'),
          res.nim,
          res.full_name,
          res.faculty || 'N/A',
          res.study_program || 'N/A',
          res.total_score,
          formatTime(res.final_time_seconds)
        ]),
        startY: 22,
        theme: 'grid',
        headStyles: { fillColor: [22, 160, 133] },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 20 },
          2: { cellWidth: 35 },
          3: { cellWidth: 25 },
          4: { cellWidth: 30 },
          5: { cellWidth: 15 },
          6: { cellWidth: 20 }
        }
      });

      doc.save(`Laporan_Hasil_Tur_VR_CleanScape_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Data berhasil diekspor ke PDF!');
    } catch (err) {
      toast.error('Gagal mengekspor data ke PDF');
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null || isNaN(seconds)) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium">Terjadi Kesalahan</h3>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DeleteConfirmationModal 
        isOpen={isModalOpen} 
        onClose={closeDeleteModal} 
        onConfirm={handleDelete} 
        message="Apakah Anda yakin ingin menghapus hasil tur ini? Aksi ini tidak dapat dibatalkan."
        loading={deleteLoading}
      />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
                <p className="text-gray-600 mt-1">Kelola hasil tur VR CleanScape</p>
                <div className="flex items-center mt-3 text-sm text-gray-500">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Total data: {results.length} hasil tur
                </div>
              </div>
              
              <ExportButtons 
                onExportExcel={handleExportExcel}
                onExportPdf={handleExportPdf}
                disabled={loading}
                resultsCount={results.length}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Peserta</p>
                  <p className="text-2xl font-semibold text-gray-900">{results.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Rata-rata Skor</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {results.length > 0 ? Math.round(results.reduce((acc, res) => acc + res.total_score, 0) / results.length) : 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Skor Tertinggi</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {results.length > 0 ? Math.max(...results.map(res => res.total_score)) : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <DataTable 
            results={results}
            onDelete={openDeleteModal}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}