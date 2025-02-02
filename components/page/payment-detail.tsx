'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { usePaymentDetail } from '@/context/payment-detail-context';
import IconPaymentAvailable from '../icon/icon_payment_available';
import IconPaymentBill from '../icon/icon_payment_bill';
import IconPaymentLoading from '../icon/icon_payment_loading';
import IconPaymentSuccess from '../icon/icon_payment_success';
import CardItemUser from '../card-item-user';
import { useEffect, useState } from 'react';
import { checkTokenActive } from '@/lib/jwt';
import CardDetailComponent from '../card-detail-component';

const PaymentDetail = () => {
  const { sharedData, setSharedData } = usePaymentDetail();
  const [namaSiswa, setNamaSiswa] = useState<string>('');
  const [kdRombel, setKdRombel] = useState<string>('');
  const [nis, setNis] = useState<string>('');
  const [exp, setExp] = useState<number>(0); // Default value set to 0
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const statusToken = checkTokenActive();
      if (statusToken.status) {
        setNamaSiswa(statusToken.data?.NAMASISWA || '-');
        setKdRombel(statusToken.data?.KDROMBEL || '-');
        setNis(statusToken.data?.data || '-');
        setToken(statusToken.cookieToken || '');
        setExp(statusToken.data?.exp || 0); // Ensure exp has a fallback value
      } else {
        console.log('Auth not found');
      }
    };
    fetchData();
  }, [setSharedData]);

  if (!sharedData || !namaSiswa || !nis || !kdRombel || !token) {
    return
  }

  return (
    <div className="min-h-screen pt-[18vh] w-screen max-w-md relative overflow-auto">
      <div className="flex flex-col mt-[20vh] items-center justify-center">
        <Card className="z-20 w-full h-screen rounded-lg pl-7 pr-7 dark:bg-slate-900 dark:bg-opacity-70 border-none">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
          >
            <Card className="mt-[-20vh] shadow-md dark:bg-opacity-70">
              <CardHeader className="flex items-center border-b-2 pb-3 dark:bg-slate-800">
                {sharedData.status === 'LUNAS' ? (
                  <IconPaymentSuccess />
                ) : sharedData.status === 'BELUM LUNAS' ||
                  sharedData.status === 'TELAT BAYAR DAN BELUM LUNAS' ? (
                  <IconPaymentBill />
                ) : sharedData.status === 'BELUM DIBAYAR' ? (
                  <IconPaymentAvailable />
                ) : (
                  <IconPaymentLoading />
                )}
                <div className="text_header flex flex-col items-center text-center leading-0">
                  <p className="font-bold text-sm">
                    Pembayaran {' '}
                    {sharedData.status === 'LUNAS'
                      ? 'Sukses'
                      : sharedData.status === 'BELUM LUNAS' ||
                        sharedData.status === 'TELAT BAYAR DAN BELUM LUNAS'
                      ? 'Cicilan'
                      : sharedData.status === 'BELUM DIBAYAR'
                      ? 'Tersedia'
                      : ''}
                  </p>
                  <small className="text-xs">
                    {sharedData.status === 'LUNAS'
                      ? 'Terimakasih. Pembayaran telah dibayarkan'
                      : sharedData.status === 'BELUM LUNAS' ||
                        sharedData.status === 'TELAT BAYAR DAN BELUM LUNAS'
                      ? 'Pastikan cicilan pembayaran dibayarkan'
                      : sharedData.status === 'BELUM DIBAYAR'
                      ? 'Lakukan pembayaran sebelum jatuh tempo'
                      : ''}
                  </small>
                </div>
              </CardHeader>

              <CardContent className="p-1">
                <CardTitle className="p-4">
                  <p className="text-[10px] font-thin">Payment Component</p>
                </CardTitle>
                <CardItemUser
                  namaSiswa={namaSiswa || '-'}
                  nis={nis || '-'}
                  kdRombel={kdRombel || '-'}
                />
              </CardContent>
              <CardContent>
                <CardDetailComponent
                  data={{ detail: sharedData }}
                  user={{
                    user: {
                      nis,
                      namaSiswa,
                      kdRombel,
                      token,
                      exp,
                    },
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentDetail;
