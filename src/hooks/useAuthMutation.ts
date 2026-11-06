import { useMutation } from '@tanstack/react-query';
import { authService, LoginPayload, LoginResponse } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { decodeJwt } from '@/lib/jwt';
import { toast } from 'sonner';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export function useLoginMutation() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data: LoginResponse) => {
      // Extract token from response
      const token =
        data.token ||
        data.access_token ||
        data.data?.token ||
        (typeof data.data === 'string' ? data.data : '');

      // Decode JWT payload to extract user identity & role
      const payload = token ? decodeJwt(String(token)) : null;

      const role =
        (payload?.groups && payload.groups[0]) ||
        data.data?.role ||
        (payload?.upn === 'admin' ? 'administrator' : 'mahasiswa');

      const user = {
        id: String(payload?.sub || data.data?.id || '1'),
        name: String(payload?.upn || data.data?.nama || data.data?.name || data.data?.username || 'Pengguna'),
        email: String(data.data?.email || ''),
        role: String(role),
      };

      setAuth(user, String(token));

      const successMsg = data.message || `Selamat datang kembali, ${user.name}!`;
      toast.success('Login Berhasil!', {
        description: successMsg,
      });

      // Role-based redirection:
      if (role === 'administrator') {
        router.push('/admin/dashboard');
      } else if (role === 'mahasiswa') {
        router.push('/mahasiswa/dashboard');
      } else {
        router.push('/dashboard');
      }
    },
    onError: (error: unknown) => {
      let message = 'Terjadi kesalahan saat masuk ke sistem.';

      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as { message?: string; error?: string };
        message = errorData.message || errorData.error || `HTTP ${error.response.status}: Gagal otentikasi.`;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error('Gagal Masuk', {
        description: message,
      });
    },
  });
}