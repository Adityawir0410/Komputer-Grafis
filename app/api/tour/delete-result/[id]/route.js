import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase di sisi server
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
);

export async function DELETE(request, { params }) {
  try {
    const { id } = params; // Ambil ID dari URL

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID tidak ditemukan.' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('tour_results')
      .delete()
      .eq('id', id); // Hapus baris yang ID-nya cocok

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Hasil tur berhasil dihapus!',
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus hasil.', error: error.message },
      { status: 500 }
    );
  }
}