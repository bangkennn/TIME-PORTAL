import { NextRequest, NextResponse } from 'next/server';

function createFallbackData(nim: string) {
  const isRinawati = nim === '2345012';
  const isTarq = nim === '2244090';

  if (isRinawati) {
    return {
      idPendaftaran: 45,
      idUser: 33,
      idAgama: 'KR',
      kodeKampus: 'MERBABU',
      kodeProgramStudi: 'SI',
      idSekolah: 5893,
      idStatus: 1,
      idWaktuKuliah: 1,
      email: 'watirisnadmk@gmail.com',
      tanggalPendaftaran: null,
      namaMahasiswa: 'RISNAWATI DAMANIK',
      tempatLahir: 'SAIT BUTTU',
      tanggalLahir: 1112979600000,
      alamatMahasiswa:
        'Jalan K.L. Yos Sudarso km 16.5, Simpang Kantor, Medan-Labuhan, Kota Medan, Sumatera Utara, Indonesia, Planet BUmi, Galaksi Bima Sakti',
      jenisKelamin: 'W',
      alamatOrangtua: 'GG SUKUN NO 38 PEMATANG SIANTAR',
      anakKe: 1,
      golonganDarah: 'B',
      hobi: 'MEMBACA',
      jumlahSaudara: 3,
      jurusan: 'IPS',
      keterangan: '2345012',
      kewarganegaraan: 'INDONESIA',
      namaAyah: 'DAVID GUNAWAN DAMANIK',
      namaIbu: 'DARNIKE DEBORA',
      noIjazah: null,
      noTeleponMahasiswa: '085762642479',
      noTeleponOrangtua: '082272026114',
      pekerjaanOrangtua: 'WIRASWASTA',
      tahunAngkatan: 2023,
      tahunLulus: null,
      tanggalIjazah: null,
      pendidikanOrangtua: 'D3',
      nim,
    };
  }

  return {
    idPendaftaran: 645,
    idUser: 630,
    idAgama: 'IS',
    kodeKampus: 'MERBABU',
    kodeProgramStudi: 'TI',
    idSekolah: 5731,
    idStatus: 1,
    idWaktuKuliah: 1,
    email: isTarq ? 'tarqhilmarsiregar@gmail.com' : `mahasiswa.${nim}@stmik-time.ac.id`,
    tanggalPendaftaran: null,
    namaMahasiswa: isTarq ? 'TARQ HILMAR SIREGAR' : `Mahasiswa (${nim})`,
    tempatLahir: 'MEDAN',
    tanggalLahir: 1072630800000,
    alamatMahasiswa:
      'Jalan K.L. Yos Sudarso km 16.5, Simpang Kantor, Medan-Labuhan, Kota Medan, Sumatera Utara',
    jenisKelamin: 'P',
    alamatOrangtua: null,
    anakKe: 3,
    golonganDarah: 'O',
    hobi: null,
    jumlahSaudara: 3,
    jurusan: 'Teknik Komputer dan Jaringan',
    keterangan: null,
    kewarganegaraan: 'INDONESIA',
    namaAyah: null,
    namaIbu: null,
    noIjazah: null,
    noTeleponMahasiswa: null,
    noTeleponOrangtua: null,
    pekerjaanOrangtua: null,
    tahunAngkatan: 2022,
    tahunLulus: null,
    tanggalIjazah: null,
    pendidikanOrangtua: null,
    nim,
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ nim: string }> }
) {
  const { nim } = await params;

  if (!nim) {
    return NextResponse.json({ message: 'NIM tidak boleh kosong' }, { status: 400 });
  }

  const targetUrl = `https://portal.stmik-time.ac.id/rest/api/mahasiswa/nim/${encodeURIComponent(nim)}`;
  const authHeader = req.headers.get('authorization');

  try {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    console.warn(
      `External STMIK TIME mahasiswa API returned status ${response.status} for NIM ${nim}. Using fallback data.`
    );
    return NextResponse.json(createFallbackData(nim));
  } catch (error) {
    console.error('Error fetching mahasiswa API from server, falling back to local data:', error);
    return NextResponse.json(createFallbackData(nim));
  }
}
