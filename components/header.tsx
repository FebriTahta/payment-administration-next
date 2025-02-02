'use client';

import { motion } from 'framer-motion';
import { DarkThemeButton } from './button/dark-theme-button';
import { 
  LogOut 
} from 'lucide-react';
import { Button } from './ui/button';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useCallback, useEffect } from 'react';
import { checkTokenActive } from '@/lib/jwt';
import Image from 'next/image';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname(); // Dapatkan path URL saat ini
  const { toast } = useToast();

  // Fungsi logout
  const handleLogout = useCallback(
    ({ desc }: { desc: string }) => {
      Cookies.remove('authToken');
      toast({
        title: 'Goodbye!',
        description: desc || 'You have been logged out.',
      });
      router.push('/login-page');
    },
    [toast, router]
  );

  // Validasi token saat komponen dimuat
  useEffect(() => {
    const validateToken = async () => {
      

      try {
        const statusToken = await checkTokenActive();
  
        if (statusToken.status === false && statusToken.data === 401) {
          handleLogout({ desc: 'Your session has expired.' });
        }
      } catch (error) {
        console.error('Error validating token:', error);
        handleLogout({ desc: 'An error occurred. Please log in again.' });
      }
    };

    validateToken();
  }, [handleLogout]);

  // Jangan render header pada halaman login
  if (pathname === '/login-page') {
    return null;
  }
  
  return (
    <motion.div
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
    >
    <div className="flex flex-row justify-between items-center w-full max-w-[450px] absolute top-4 px-4 z-50">
      {/* Tombol kiri */}
     
        <Button
            className='w-[50px]'
            onClick={() => handleLogout({ desc: 'You have been logged out.' })}
            variant="destructive"
          >
            <LogOut/>
        </Button>
        <div className='icon'>
            <Image
              className='hidden dark:block'
              src='/web-02.png'
              alt='logo'
              width={120}
              height={50}
            />
            <Image
              className='dark:hidden block'
              src='/web-03.png'
              alt='logo'
              width={120}
              height={50}
            />
        </div>
        <DarkThemeButton />
      
    </div>
    </motion.div>
  );
};

export default Header;
