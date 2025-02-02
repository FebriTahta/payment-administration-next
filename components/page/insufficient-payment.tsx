'use client';
import {motion} from "framer-motion";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import CardInsufficientComponent from "../card-insufficient-component";
import {insufficientPayment} from "@/api/insufficient-payment";
import {ApiResponse} from "@/interface/insufficient-payment-page";
import { useState, useEffect } from 'react';
import { checkTokenActive } from '@/lib/jwt';
import SkeletonPaymentList from "../skeleton-payment-list";
import CardKeteranganOk from "../card-keterangan-ok";

const InsufficientPayment = () => {

    const [resInsufficientPayment, setResInsufficientPayment] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchData = async () => {
          try {
              const statusToken = checkTokenActive();
              if (statusToken.status) {
                  const responseApi = await insufficientPayment(
                      statusToken.data?.data || '', 
                      statusToken.data?.KDROMBEL || '-', 
                      statusToken.cookieToken
                  );
                  setResInsufficientPayment(responseApi);
                  
              } else {
                  setError('Authentication not found. Please log in.');
              }
          } catch (error) {
              setError(error instanceof Error ? error.message : 'Failed to fetch data.');
          } finally {
              setLoading(false);
          }
      };

      fetchData();
    }, []); // Dependency array kosong untuk mencegah infinite loop

    return (
      <div className="h-full pt-[15vh] w-screen max-w-md relative">
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
        >
          <div className="flex flex-col mt-[2vh] items-center justify-center">
            <Card className="flex z-50 dark:bg-slate-900 dark:bg-opacity-70">
                <CardHeader className="pt-2 pb-2">
                    <CardTitle className="text-sm">Kekurangan Pembayaran</CardTitle>
                    <CardDescription className="text-xs">Daftar kekurangan pembayaran belum lunas</CardDescription>
                </CardHeader>
            </Card>
            <Card className="z-20 mt-[-40px] w-full h-screen rounded-[30px] dark:bg-slate-900 dark:bg-opacity-70">
              <CardHeader className="pt-16">
                {
                  (()=>{
                    const insufficient = resInsufficientPayment?.data.data.InsufficientComponents ?? [];
                    const noInsufficient = insufficient.length === 0;

                    if (loading) {
                      return <SkeletonPaymentList/>
                    }

                    if (error) {
                      return (
                          <>
                              <SkeletonPaymentList />
                              <div className="flex justify-center shadow-none dark:bg-slate-900 dark:bg-opacity-70 rounded-lg mt-5">
                                  <p className="text-red-500 text-[10px] pb-5 mt-5">
                                      {error || 'TIDAK ADA TUNGGAKAN / CICILAN'}
                                  </p>
                              </div>
                          </>
                      );
                    }

                    if (noInsufficient) {
                      return (
                        <>
                            <CardKeteranganOk />
                            <div className="flex justify-center shadow-none dark:bg-slate-900 dark:bg-opacity-70 rounded-lg mt-5">
                                <p className=" text-[10px] pb-5 mt-5">
                                    {error || 'TIDAK ADA TUNGGAKAN / CICILAN'}
                                </p>
                            </div>
                        </>
                      );
                    }

                    return insufficient.length > 0 ? (
                        <CardInsufficientComponent className="mb-5" data={insufficient} />
                    ) : (
                        <p>No payment data available.</p>
                    );
                  })()}
              </CardHeader>
            </Card>
          </div>
        </motion.div>
      </div>
    )
}

export default InsufficientPayment