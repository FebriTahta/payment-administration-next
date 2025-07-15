'use client';

import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { motion } from 'framer-motion';
import IconBri from "../icon/icon_bri";
import IconBni from "../icon/icon_bni";
import IconMandiri from "../icon/icon_mandiri";
import { Button } from "../ui/button";
import IconPermata from "../icon/icon_permata";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePaymentOption } from "@/context/payment-option-context";
import IconPaymentAvailable from '../icon/icon_payment_available';
import IconGopay from "../icon/icon_gopay";
import { createTransaction } from "@/api/create-transaction";
import { getFcmToken, onMessageListener, requestNotificationPermission } from "@/utils/fcm-notification";
import { createFcmWebToken } from '@/api/create-fcm-web-token';
import { checkTokenActive } from '@/lib/jwt';


interface ComponentPayload {
    componentsCode: string;
    nominal: number;
}

interface CustomerDetailsPayload {
    nis: string;
    name: string;
    kdrombel: string;
    tahun_ajaran: string;
}

interface TransactionPayload {
    grossAmount: number;
    components: ComponentPayload[];
    customerDetails: CustomerDetailsPayload;
    paymentType: "bank_transfer" | "gopay";
    gopay?: {
        enable_callback: boolean;
        callback_url: string;
    };
    bank?: string;
}

const PaymentOption = () => {
    const [selectedPayment, setSelectedPayment] = useState<keyof typeof paymentDetails | null>(null);
    const { shareDataPaymentOption, setSharedDataPaymentOption } = usePaymentOption();
    const router = useRouter();
    const { toast } = useToast();
    const isInitialized = useRef(false); // Untuk mencegah pemanggilan ulang
    const cachedToken = useRef<string | null>(null);
    const [onClickLoading, setOnClickLoading] = useState(false);
    const [token, setToken] = useState<string>('');
    const [nis, setNis] = useState<string>('');

    const totalNominal = shareDataPaymentOption?.selectedComponents?.reduce(
        (total, component) => total + component.nominal_harus_dibayar,
        0
    ) || 0;

    const paymentDetails = {
        bri: { title: "BRI VA", description: "Membuat proses pembayaran dengan metode VA Bank BRI", type: "bank_transfer" },
        bni: { title: "BNI VA", description: "Membuat proses pembayaran dengan metode VA Bank BNI", type: "bank_transfer" },
        mandiri: { title: "Mandiri VA", description: "Membuat proses pembayaran dengan metode VA Bank Mandiri", type: "bank_transfer" },
        permata: { title: "Permata VA", description: "Membuat proses pembayaran dengan metode VA Bank Permata", type: "bank_transfer" },
        gopay: { title: "Gopay", description: "The payment will be generated with Gopay", type: "gopay" },
    };

    const finalTotalNominal = totalNominal + 5000;
    

    useEffect(() => {
        const fetchData = async () => {
          try {
              const statusToken = checkTokenActive();
              if (statusToken.status) {
                  setToken(statusToken.cookieToken || '');
                  setNis(statusToken.data.data);
                  
              }
          } catch (error) {
              console.log(error instanceof Error ? error.message : 'Failed to fetch data.');
          } finally {
              console.log('ok');
          }
        }
        fetchData();
      }, []);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem("paymentOption");
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                if (parsedData && typeof parsedData === "object") {
                    setSharedDataPaymentOption(parsedData);
                }
            }
        } catch (error) {
            console.error("Failed to parse paymentOption from localStorage:", error);
        }
    }, [setSharedDataPaymentOption]);
    
    useEffect(() => {
        if (shareDataPaymentOption) {
            localStorage.setItem("paymentOption", JSON.stringify(shareDataPaymentOption));
        }
    }, [shareDataPaymentOption]);
    
    

    useEffect(() => {
        const initializeFcm = async () => {
          if (isInitialized.current) return; // If already initialized, stop
      
          // Wait until both token and nis are available
          if (token && nis) {
              
              if (typeof window !== "undefined") { // Ensure it runs on client side
                  const hasPermission = await requestNotificationPermission();
                  if (hasPermission && !cachedToken.current) {
    
                      const web_token = await getFcmToken();
                      cachedToken.current = web_token; // Cache the token
    
                      await createFcmWebToken({
                          nis: nis,
                          web_token: web_token
                      }, token);
                  }
      
                  // Listener for notification messages
                  onMessageListener().then((payload) => {
                      console.log("Notification received:", payload);
                  });
      
                  isInitialized.current = true; // Mark as initialized
              }
          }
        };
      
        initializeFcm();
      }, [nis, token]); // Trigger this effect only when both nis and token are available

    const handleContinue = async () => {
        if (!selectedPayment || !shareDataPaymentOption) {
            toast({
                title: "Error",
                description: "Payment option is not selected",
            });
            return;
        }
    
        const isBankTransfer = ["bri", "bni", "mandiri", "permata"].includes(selectedPayment);
    
        const payload: TransactionPayload = {
            grossAmount: finalTotalNominal,
            components: shareDataPaymentOption?.selectedComponents.map((item) => ({
                componentsCode: item.kd_komponen.toString(),
                nominal: item.nominal_harus_dibayar,
            })) || [],
            customerDetails: {
                nis: shareDataPaymentOption?.auth?.data?.data || "",
                name: shareDataPaymentOption?.auth?.data?.NAMASISWA || "",
                kdrombel: shareDataPaymentOption?.auth?.data?.KDROMBEL || "",
                tahun_ajaran: shareDataPaymentOption?.auth?.data?.TAHUN_AJARAN || "",
            },
            paymentType: isBankTransfer ? "bank_transfer" : "gopay", // Set paymentType sesuai metode pembayaran
        };
    
        // Tambahkan detail khusus berdasarkan tipe pembayaran
        if (isBankTransfer) {
            payload.bank = selectedPayment; // bank_transfer membutuhkan nama bank
        } else {
            payload.gopay = {
                enable_callback: true,
                callback_url: "https://app.smkkrian1.site/payment-list",
            };
        }

        if (!shareDataPaymentOption?.auth?.cookieToken) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Token tidak ditemukan, silakan login ulang.",
            });
            return;
        }
        
        setOnClickLoading(true);
        try {
            const response = await createTransaction(payload, shareDataPaymentOption.auth.cookieToken);
            console.log(shareDataPaymentOption.auth.cookieToken);
            
            // 201 created 
            // 200 exist
            // else error
            
            if (response.status === 200) {
                toast({
                    variant: "destructive",
                    title: "PEMBAYARAN AKTIF DITEMUKAN!",
                    description: "Selesaikan pembayaran aktif Anda terlebih dahulu.",
                });
            } else if (response.status === 201) {
                toast({
                    title: "BERHASIL MEMBUAT PEMBAYARAN!",
                    description: "Silahkan bayar terlebih dahulu.",
                });
                router.push("/active-payment");
            } else {
                toast({
                    variant: "destructive",
                    title: "CREATE TRANSACTION FAILED",
                    description: response.message || "Terjadi kesalahan, coba lagi nanti.",
                });
            }
            
            // Pastikan `setOnClickLoading` di-reset setelah menangani semua kondisi
            setOnClickLoading(false);
            
            
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to process the transaction",
            });
            setOnClickLoading(false);
        }
    };
    
    

    return (
        <div className="min-h-screen pt-[15vh] w-screen max-w-md relative overflow-auto">
            <div className="flex flex-col mt-[20vh] items-center justify-center">
                <Card className="z-20 w-full h-screen rounded-none pl-7 pr-7 dark:bg-slate-900 dark:bg-opacity-70 border-none">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
                    >
                        <Card className="mt-[-20vh] shadow-md dark:bg-opacity-70">
                            <CardHeader className="flex items-center border-b-2 pb-2 dark:bg-slate-800 rounded-t-lg">
                                <IconPaymentAvailable />
                                <div className="text_header flex flex-col items-center text-center leading-0">
                                    <p className="font-bold text-[10px]">Lakukan Pembayaran</p>
                                    <small className="text-[9px]">Pastikan daftar pembayaran telah sesuai</small>
                                </div>
                            </CardHeader>
                            <CardHeader className="keterangan leading-[10px] p-3 border-b-2">
                                <div className="flex justify-between text-[9px]">
                                    <p>Administrasi</p>
                                    <p>Rp 5.000</p>
                                </div>
                                <div className="flex justify-between text-[9px]">
                                    <p>Payment</p>
                                    <p>{`Total: Rp ${finalTotalNominal.toLocaleString()}`}</p>
                                </div>
                                <div className="flex justify-between text-[9px]">
                                    <p>Component</p>
                                    <p>{shareDataPaymentOption?.selectedComponents.length} Component</p>
                                </div>
                            </CardHeader>
                            <CardHeader className="list leading-[10px] p-3 border-b-2">
                                {shareDataPaymentOption?.selectedComponents.map((item, index) => (
                                    <div key={index} className="flex justify-between text-[9px]">
                                        <p>{item.nama_komponen}</p>
                                        <p>Rp {item.nominal_harus_dibayar.toLocaleString()}</p>
                                    </div>
                                ))}
                            </CardHeader>
                            <CardTitle className="p-3 leading-[5px]">
                                <p className="text-[9px] font-thin mb-2">Choose Payment Option</p>
                                <p className="text-[9px]">Bank Transfer VA / E Wallet</p>
                            </CardTitle>
                            <AlertDialog>
                                <CardContent className="flex flex-row justify-between gap-2 pl-3 mb-0 pb-2">
                                    {(["bri", "bni", "mandiri"] as Array<keyof typeof paymentDetails>).map((method) => (
                                        <AlertDialogTrigger
                                            asChild
                                            key={method}
                                            onClick={() => setSelectedPayment(method)}
                                        >
                                            <Button className={`${method} bg-transparent bg-gray-50 dark:bg-slate-400 hover:bg-gray-200`}>
                                                {method === "bri" && <IconBri />}
                                                {method === "bni" && <IconBni />}
                                                {method === "mandiri" && <IconMandiri />}
                                            </Button>
                                        </AlertDialogTrigger>
                                    ))}
                                </CardContent>
                                <CardContent className="flex flex-row pl-3 gap-2">
                                    {(["permata"] as Array<keyof typeof paymentDetails>).map((method) => (
                                        <AlertDialogTrigger
                                            asChild
                                            key={method}
                                            onClick={() => setSelectedPayment(method)}
                                        >
                                            <Button className={`${method} bg-transparent bg-gray-50 dark:bg-slate-400 hover:bg-gray-200`}>
                                                {method === "permata" && <IconPermata />}
                                            </Button>
                                        </AlertDialogTrigger>
                                    ))}
                                    {(["gopay"] as Array<keyof typeof paymentDetails>).map((method) => (
                                        <AlertDialogTrigger
                                            asChild
                                            key={method}
                                            onClick={() => setSelectedPayment(method)}
                                        >
                                            <Button className={`${method} bg-transparent bg-gray-50 dark:bg-slate-400 hover:bg-gray-200`}>
                                                {method === "gopay" && <IconGopay />}
                                            </Button>
                                        </AlertDialogTrigger>
                                    ))}
                                </CardContent>

                                {selectedPayment && (
                                    <AlertDialogContent className="max-w-[300px] rounded-lg dark:bg-slate-800">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                {paymentDetails[selectedPayment].title}
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {paymentDetails[selectedPayment].description}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="flex gap-1 justify-between items-center">
                                            <AlertDialogCancel className="flex flex-1 w-full text-center py-2">
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                className="flex flex-1 w-full text-center py-2"
                                                onClick={handleContinue}
                                            >
                                                {onClickLoading ? (
                                                    <>
                                                        <svg
                                                        aria-hidden="true"
                                                        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                                        viewBox="0 0 100 101"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                        <path
                                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                            fill="currentColor"
                                                        />
                                                        <path
                                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                            fill="currentFill"
                                                        />
                                                        </svg>
                                                        Loading
                                                    </>
                                                    
                                                    ) : (
                                                        "Bayar Sekarang"
                                                    )}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                )}
                            </AlertDialog>
                        </Card>
                    </motion.div>
                </Card>
            </div>
        </div>
    );
};

export default PaymentOption;
