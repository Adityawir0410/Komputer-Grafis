import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase di sisi server
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY, // Gunakan Service Key untuk keamanan di server
);

export async function POST(request) {
  try {
    const data = await request.json();

    // Validasi data dasar
    if (!data.nim || data.total_score == null || data.final_time_seconds == null) {
      return NextResponse.json(
        { success: false, message: 'Data tidak lengkap.' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('tour_results')
      .insert([
        {
          full_name: data.fullName,
          nim: data.nim,
          faculty: data.faculty,
          study_program: data.studyProgram,
          total_score: data.total_score,
          final_time_seconds: data.final_time_seconds,
        },
      ]);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Hasil tur berhasil disimpan!',
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan hasil.', error: error.message },
      { status: 500 }
    );
  }
}