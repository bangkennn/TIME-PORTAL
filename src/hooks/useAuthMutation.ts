import { useMutation } from '@tanstack/react-query';
import { authService, LoginPayload, LoginResponse } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import axios from 'axios';

import { useRouter } from 'next/navigation';

export function useLoginMutation() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onMutate: () => {
      // Optional: loading toast id if desired
    },
    onSuccess: (data: LoginResponse) => {
      // Extract token and user data dynamically based on response structure
      const token =
        data.token ||
        data.access_token ||
        data.data?.token ||
        (typeof data.data === 'string' ? data.data : 'auth-token');

      const user = {
        id: String(data.data?.id || '1'),
        name: String(data.data?.nama || data.data?.name || data.data?.username || 'Pengguna'),
        email: String(data.data?.email || ''),
        role: String(data.data?.role || ''),
      };

      setAuth(user, String(token));

      const successMsg = data.message || 'Selamat datang di Portal STMIK TIME';
      toast.success('Login Berhasil!', {
        description: successMsg,
      });

      // Redirect ke halaman /dashboard
      router.push('/dashboard');
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
