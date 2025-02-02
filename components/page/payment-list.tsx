'use client';
import {motion} from "framer-motion";
import { useState, useEffect } from 'react';
import { paymentList } from "@/api/payment-list";
import { ApiResponse } from "@/interface/payment-list-page";
import { checkTokenActive } from '@/lib/jwt';
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { CardPaymentList } from "../card-payment-list";
import SkeletonPaymentList from "../skeleton-payment-list";

const PaymentList = () => {
    const [apiPaymentList, setApiPaymentList] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statusToken = checkTokenActive();
                if (statusToken.status) {
                    const responseApi = await paymentList(
                        statusToken.data?.data || '', 
                        statusToken.data?.KDROMBEL || '-', 
                        statusToken.cookieToken
                    );
                    setApiPaymentList(responseApi);
                    
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
                    <Card className="flex z-50 dark:bg-slate-800 dark:bg-opacity-70">
                        <CardHeader className="pt-2 pb-2">
                            <CardTitle className="text-sm">Daftar Pembayaran</CardTitle>
                            <CardDescription className="text-xs">Daftar pembayaran yang telah dilakukan</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="z-20 mt-[-40px] w-full h-screen rounded-[30px] dark:bg-slate-900 dark:bg-opacity-70">
                        <CardHeader className="pt-16">
                            <div className="flex flex-col overflow-y-auto pb-4 h-[62vh] scroll-smooth">
                            {(() => {
                                const payments = apiPaymentList?.data?.data?.payments ?? [];
                                const noPayments = payments.length === 0;
                                
                                if (loading) {
                                    return <SkeletonPaymentList />;
                                }

                                if (error || noPayments) {
                                    return (
                                        <>
                                            <SkeletonPaymentList />
                                            <div className="flex justify-center shadow-none dark:bg-slate-900 dark:bg-opacity-70 rounded-lg mt-5">
                                                <p className="text-red-500 text-[10px] pb-5">
                                                    {error || '404 Not Available'}
                                                </p>
                                            </div>
                                        </>
                                    );
                                }

                                return payments.length > 0 ? (
                                    <CardPaymentList className="mb-5" data={payments} />
                                ) : (
                                    <p>No payment data available.</p>
                                );
                            })()}
                             <div className="mt-[50px]"></div>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentList;
