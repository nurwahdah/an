// ==================================================
// SISTEM ANALISIS KEMUNGKINAN ANEMIA PADA PEREMPUAN
// ==================================================

// Jalankan kode setelah seluruh elemen halaman selesai dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Hubungkan tombol dengan fungsi analisis
    const tombolAnalisis = document.querySelector('button[type="button"]');
    if (tombolAnalisis) {
        tombolAnalisis.addEventListener('click', jalankanAnalisis);
    }
});

// ==================================================
// FUNGSI UTAMA: Mengambil Data & Memproses Analisis
// ==================================================
function jalankanAnalisis() {
    try {
        // 1. AMBIL SEMUA DATA DARI FORM
        const data = {
            sistolik: ambilNilaiAngka('sistolik'),
            diastolik: ambilNilaiAngka('diastolik'),
            umur: ambilNilaiAngka('umur'),
            tinggi: ambilNilaiAngka('Tinggi'),
            berat: ambilNilaiAngka('Berat badan'),
            aktivitas: ambilNilaiTeks('aktivitas'),
            konsumsi: ambilNilaiTeks('konsumsi'),
            menstruasi: ambilNilaiTeks('menstruasi'),
            polaMakan: ambilNilaiTeks('polaMakan')
        };

        // 2. VALIDASI DATA WAJIB
        if (!data.sistolik || !data.diastolik) {
            tampilkanPeringatan('❌ Harap isi Tekanan Darah Sistolik dan Diastolik terlebih dahulu!');
            return;
        }

        // 3. PROSES ANALISIS
        const hasilBMI = analisisBMI(data.berat, data.tinggi);
        const hasilTekanan = analisisTekananDarah(data.sistolik, data.diastolik);
        const hasilRisiko = analisisRisikoAnemia(
            data.umur,
            data.menstruasi,
            data.polaMakan,
            data.aktivitas,
            data.konsumsi
        );

        // 4. TAMPILKAN SEMUA HASIL KE HALAMAN
        tampilkanHasil(hasilBMI, hasilTekanan, hasilRisiko);

    } catch (kesalahan) {
        // Tangani jika ada kesalahan sistem yang tidak terduga
        console.error('Terjadi kesalahan saat memproses data:', kesalahan);
        tampilkanPeringatan('⚠️ Maaf, terjadi kesalahan sistem. Silakan coba lagi.');
    }
}

// ==================================================
// FUNGSI BANTUAN: Mengambil Nilai ANGKA dari Input
// ==================================================
function ambilNilaiAngka(idElemen) {
    const elemen = document.getElementById(idElemen);
    if (!elemen) return null;

    const nilai = elemen.value.trim();
    return nilai === '' ? null : parseFloat(nilai);
}

// ==================================================
// FUNGSI BANTUAN: Mengambil Nilai PILIHAN/TEKS
// ==================================================
function ambilNilaiTeks(idElemen) {
    const elemen = document.getElementById(idElemen);
    if (!elemen) return '';

    return elemen.value.trim();
}

// ==================================================
// ANALISIS 1: Menghitung & Menilai Indeks Massa Tubuh (BMI)
// ==================================================
function analisisBMI(berat, tinggi) {
    // Cek jika data kosong atau tidak valid
    if (!berat || !tinggi || tinggi <= 0) {
        return {
            status: 'Data Belum Lengkap',
            keterangan: 'Isi Berat Badan dan Tinggi Badan untuk melihat hasil.',
            kelas: 'status-peringatan'
        };
    }

    // Rumus BMI: Berat (kg) dibagi (Tinggi dalam meter x Tinggi dalam meter)
    const tinggiMeter = tinggi / 100;
    const nilaiBMI = berat / (tinggiMeter * tinggiMeter);
    let status, keterangan, kelas;

    // Klasifikasi khusus untuk perempuan
    if (nilaiBMI < 18.5) {
        status = 'Berat Badan Kurang';
        keterangan = `Nilai BMI Anda: ${nilaiBMI.toFixed(1)}. <br>Berat badan kurang berisiko mengalami kekurangan zat gizi, termasuk zat besi yang penting untuk mencegah anemia.`;
        kelas = 'status-peringatan';
    } else if (nilaiBMI >= 18.5 && nilaiBMI < 25) {
        status = 'Berat Badan Ideal';
        keterangan = `Nilai BMI Anda: ${nilaiBMI.toFixed(1)}. <br>Berat badan ideal mendukung kesehatan tubuh yang baik dan menurunkan risiko berbagai penyakit.`;
        kelas = 'status-normal';
    } else if (nilaiBMI >= 25 && nilaiBMI < 30) {
        status = 'Berat Badan Berlebih';
        keterangan = `Nilai BMI Anda: ${nilaiBMI.toFixed(1)}. <br>Disarankan menjaga pola makan dan rutin beraktivitas fisik agar kesehatan tetap terjaga.`;
        kelas = 'status-peringatan';
    } else {
        status = 'Obesitas';
        keterangan = `Nilai BMI Anda: ${nilaiBMI.toFixed(1)}. <br>Risiko berbagai penyakit meningkat, perbaiki pola hidup dan konsultasikan dengan ahli gizi/dokter.`;
        kelas = 'status-bahaya';
    }

    return { status, keterangan, kelas };
}

// ==================================================
// ANALISIS 2: Menilai Kondisi Tekanan Darah
// ==================================================
function analisisTekananDarah(sistolik, diastolik) {
    let status, keterangan, kelas;

    if (sistolik < 90 || diastolik < 60) {
        status = 'Tekanan Darah Rendah';
        keterangan = `Tekanan Anda: ${sistolik}/${diastolik} mmHg. <br>Tekanan darah rendah sering berkaitan dengan gejala lemas, pusing, dan mudah pingsan — yang juga merupakan tanda umum anemia.`;
        kelas = 'status-peringatan';
    } else if (sistolik >= 90 && sistolik < 120 && diastolik >= 60 && diastolik < 80) {
        status = 'Tekanan Darah Normal';
        keterangan = `Tekanan Anda: ${sistolik}/${diastolik} mmHg. <br>Tekanan darah Anda dalam kondisi sehat dan mendukung aliran oksigen yang baik ke seluruh tubuh.`;
        kelas = 'status-normal';
    } else if ((sistolik >= 120 && sistolik < 140) || (diastolik >= 80 && diastolik < 90)) {
        status = 'Tekanan Darah Tinggi (Batas)';
        keterangan = `Tekanan Anda: ${sistolik}/${diastolik} mmHg. <br>Perlu menjaga pola makan rendah garam, istirahat cukup, dan kelola stres dengan baik.`;
        kelas = 'status-peringatan';
    } else {
        status = 'Tekanan Darah Tinggi';
        keterangan = `Tekanan Anda: ${sistolik}/${diastolik} mmHg. <br>Kondisi ini memerlukan perhatian serius, disarankan berkonsultasi dengan dokter untuk penanganan yang tepat.`;
        kelas = 'status-bahaya';
    }

    return { status, keterangan, kelas };
}

// ==================================================
// ANALISIS 3: Menilai Risiko Terkena Anemia (INTI UTAMA)
// ==================================================
function analisisRisikoAnemia(umur, menstruasi, polaMakan, aktivitas, konsumsi) {
    let skorRisiko = 0;
    let daftarFaktor = [];
    let daftarSaran = [];

    // 1. Penilaian Berdasarkan Usia
    if (umur) {
        if (umur >= 12 && umur <= 19) {
            skorRisiko += 2;
            daftarFaktor.push('• Usia Remaja: Kebutuhan zat besi meningkat tajam akibat masa pertumbuhan dan perkembangan tubuh');
        } else if (umur >= 20 && umur <= 45) {
            skorRisiko += 1;
            daftarFaktor.push('• Usia Subur: Risiko kehilangan darah setiap bulan saat menstruasi membutuhkan asupan zat besi yang cukup');
        } else if (umur > 45) {
            skorRisiko += 1;
            daftarFaktor.push('• Usia Menjelang Menopause: Perubahan hormon dapat memengaruhi penyerapan zat gizi');
        }
    }

    // 2. Penilaian Berdasarkan Kondisi Menstruasi
    switch (menstruasi) {
        case 'Panjang → lebih dari 35 hari':
        case 'Pendek → kurang dari 25 hari':
        case 'tidak teratur':
            skorRisiko += 3;
            daftarFaktor.push('• Siklus Haid Tidak Normal: Menandakan gangguan kesehatan atau ketidakseimbangan hormon yang dapat memengaruhi kadar darah');
            daftarSaran.push('🔹 Pantau jadwal haid Anda secara rutin, jika terus tidak teratur periksakan ke dokter');
            break;
        case 'Tidak menstruasi (amenore) → tidak haid selama beberapa bulan':
            skorRisiko += 4;
            daftarFaktor.push('• Berhenti Haid Berbulan-bulan: Risiko gangguan kesehatan serius yang berdampak langsung pada kondisi darah dan tubuh');
            daftarSaran.push('🔹 Segeralah berkonsultasi dengan dokter kandungan untuk mengetahui penyebab dan penanganannya');
            break;
        case 'normal':
            skorRisiko += 0;
            daftarFaktor.push('• Siklus Haid Normal: Kondisi kesehatan reproduksi berjalan dengan baik dan teratur');
            break;
    }

    // 3. Penilaian Berdasarkan Pola Makan
    if (polaMakan === 'kurang') {
        skorRisiko += 4;
        daftarFaktor.push('Pola Makan Kurang Zat Besi: Merupakan penyebab utama terjadinya anemia gizi pada perempuan');
        daftarSaran.push('Perbanyak konsumsi daging merah, hati ayam/sapi, ikan, telur, bayam, dan kacang-kacangan');
        daftarSaran.push('Makan buah kaya Vitamin C seperti jeruk, jambu, atau tomat bersamaan dengan makanan sumber zat besi agar penyerapan lebih baik');
        daftarSaran.push('Hindari minum teh, kopi, atau susu tepat setelah makan karena menghambat penyerapan zat besi');
    } else {
        skorRisiko += 0;
        daftarFaktor.push('• Pola Makan Sudah Baik: Asupan zat besi dan nutrisi pendukung sudah terpenuhi dengan cukup');
    }

    // 4. Penilaian Berdasarkan Aktivitas Fisik
    if (aktivitas === 'rendah') {
        skorRisiko += 1;
        daftarFaktor.push('• Aktivitas Fisik Kurang: Metabolisme tubuh berjalan kurang optimal sehingga penyerapan zat gizi tidak maksimal');
        daftarSaran.push('Lakukan aktivitas fisik ringan seperti berjalan kaki, senam, atau bersepeda minimal 30 menit sehari');
    } else if (aktivitas === 'tinggi') {
        skorRisiko += 2;
        daftarFaktor.push('• Aktivitas Fisik Tinggi: Kebutuhan oksigen dan zat besi dalam tubuh menjadi lebih tinggi dari biasanya');
        daftarSaran.push('Pastikan asupan gizi dan cairan cukup untuk mengimbangi energi yang terpakai saat beraktivitas');
    }

    // 5. Penilaian Berdasarkan Konsumsi Makanan Asin/Olahan
    if (konsumsi === 'sering') {
        skorRisiko += 1;
        daftarFaktor.push('Sering Makan Makanan Asin/Olahan: Kandungan garam dan bahan pengawet dapat mengganggu penyerapan zat gizi penting');
        daftarSaran.push('Kurangi konsumsi makanan instan, camilan asin, dan makanan tinggi pengawet');
    }

    // ==================================================
    // MENENTUKAN HASIL AKHIR BERDASARKAN SKOR
    // ==================================================
    let status, keterangan, kelas;

    if (skorRisiko >= 7) {
        status = '⚠️ RISIKO TINGGI TERKENA ANEMIA';
        kelas = 'status-bahaya';
        keterangan = `Berdasarkan data yang Anda masukkan, risiko Anda terkena anemia cukup tinggi.<br><br>
                      <strong>Faktor Penyumbang:</strong><br> ${daftarFaktor.join('<br>')} <br><br>
                      <strong>Saran Penanganan & Pencegahan:</strong><br> ${daftarSaran.join('<br>')} <br><br>
                      <strong>❗ Segeralah memeriksakan diri ke Puskesmas atau Dokter untuk cek kadar Hemoglobin (Hb) dan mendapatkan penanganan yang tepat.</strong>`;
    } else if (skorRisiko >= 3 && skorRisiko < 7) {
        status = '⚠️ RISIKO SEDANG / BERISIKO RINGAN';
        kelas = 'status-peringatan';
        keterangan = `Anda memiliki beberapa faktor yang dapat menyebabkan anemia jika tidak segera diperbaiki.<br><br>
                      <strong>Faktor Penyumbang:</strong><br> ${daftarFaktor.join('<br>')} <br><br>
                      <strong>Saran Penanganan & Pencegahan:</strong><br> ${daftarSaran.join('<br>')} <br><br>
                      Mulailah melakukan perbaikan pola hidup mulai sekarang agar kondisi kesehatan tidak memburuk.`;
    } else {
        status = '✅ RISIKO RENDAH / KONDISI SEHAT';
        kelas = 'status-normal';
        keterangan = `Kondisi Anda tergolong sehat dengan risiko anemia yang sangat rendah.<br><br>
                      <strong>Kondisi Pendukung Kesehatan:</strong><br> ${daftarFaktor.join('<br>')} <br><br>
                      Tetap pertahankan pola hidup sehat dan perhatikan asupan gizi sehari-hari agar kondisi tetap terjaga.`;
    }

    return { status, keterangan, kelas };
}

// ==================================================
// FUNGSI: Menampilkan Semua Hasil Analisis ke Halaman
// ==================================================
function tampilkanHasil(bmi, tekanan, anemia) {
    // Tampilkan Hasil BMI
    const elemenBMI = document.getElementById('hasilBMI');
    elemenBMI.className = bmi.kelas;
    elemenBMI.innerHTML = `<strong>📊 HASIL BERAT BADAN (BMI): ${bmi.status}</strong><br> ${bmi.keterangan}`;

    // Tampilkan Hasil Tekanan Darah
    const elemenTekanan = document.getElementById('hasilTekanan');
    elemenTekanan.className = tekanan.kelas;
    elemenTekanan.innerHTML = `<strong>🩸 HASIL TEKANAN DARAH: ${tekanan.status}</strong><br> ${tekanan.keterangan}`;

    // Tampilkan Hasil Risiko Anemia
    const elemenAnemia = document.getElementById('hasilAnemia');
    elemenAnemia.className = anemia.kelas;
    elemenAnemia.innerHTML = `<strong>🔴 ANALISIS RISIKO ANEMIA: ${anemia.status}</strong><br><br> ${anemia.keterangan}`;

    // Gulirkan halaman secara otomatis ke bagian hasil
    document.querySelector('.card:last-child').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==================================================
// FUNGSI: Menampilkan Pesan Peringatan/Kesalahan
// ==================================================
function tampilkanPeringatan(teks) {
    alert(teks);
}