import { useQuery } from '@tanstack/react-query';
import { mahasiswaService } from '@/services/mahasiswa.service';
import { useAuthStore } from '@/store/useAuthStore';
import { MahasiswaDetail } from '@/types/mahasiswa';

export function useMahasiswaProfile(nim?: string) {
  const token = useAuthStore((state) => state.token);
  const authUserNim = useAuthStore((state) => state.user?.name);
  const activeNim = nim || authUserNim;

  return useQuery<MahasiswaDetail, Error>({
    queryKey: ['mahasiswa', 'profile', activeNim, token],
    queryFn: () => {
      if (!activeNim) {
        throw new Error('NIM tidak ditemukan');
      }
      return mahasiswaService.getByNim(activeNim, token || undefined);
    },
    // Pastikan request HANYA dikirim saat token sudah terbaca dari store
    enabled: Boolean(activeNim && token),
    staleTime: 1000 * 60 * 5, // 5 menit cache
  });
}
