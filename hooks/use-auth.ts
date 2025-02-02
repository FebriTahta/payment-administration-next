import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (!token) {
      router.push('/login-page'); // Arahkan ke halaman login jika belum login
    }
  }, [router]);
};
