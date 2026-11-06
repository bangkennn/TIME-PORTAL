import axios from 'axios';
import { MahasiswaDetail } from '@/types/mahasiswa';

export const mahasiswaService = {
  async getByNim(nim: string, token?: string): Promise<MahasiswaDetail> {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    const response = await axios.get<MahasiswaDetail>(`/api/mahasiswa/${encodeURIComponent(nim)}`, {
      headers,
    });
    return response.data;
  },
};
