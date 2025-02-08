'use client'
import { motion } from "framer-motion";
import { Card, CardFooter, CardHeader } from "../ui/card";
import IconPaymentLoadingDogy from "../icon/icon_payment_loading_dogy";
import Countdown from "@/components/Countdown";
import { useToast } from "@/hooks/use-toast";
import { CopyIcon, QrCode, Smartphone } from "lucide-react";
import { Button } from "../ui/button";
import { transactionStatus } from "@/api/transaction-status";
import { checkTokenActive } from '@/lib/jwt';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ApiResponse } from "@/interface/midtrans-payment";
import TransactionSkeleton from "../skeleton-transaction";
import CountdownSkeleton from "../skeleton-countdown";
import { getFcmToken, onMessageListener, requestNotificationPermission } from "@/utils/fcm-notification";
import Image from "next/image";
import IconTimesUp from "../icon/icon_timesup";
import IconError from "../icon/icon_error";
import IconLoading from "../icon/icon_loading";
import IconPaymentSuccess from "../icon/icon_payment_success";
// import SkeletonPaymentList from "../skeleton-payment-list";

const StatusPayment = ({ orderId }: { orderId: string }) => {

  const { toast } = useToast();
  const [apiTransactionStatus, setapiTransactionStatus] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusTransaction, setStatusTransaction] = useState("");
  const [showQrDialog, setShowQrDialog] = useState(false); // State for QR dialog
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null); // State for dynamic QR code URL
  const isInitialized = useRef(false); // Untuk mencegah pemanggilan ulang
  const cachedToken = useRef<string | null>(null);
  const [onClickLoadingStatus, setOnClickLoadingStatus] = useState(false);
  const [messageNow, setMessageNow] = useState<string>('');
  
  const fetchData = useCallback(async (orderId: string) => {
    try {
      const statusToken = checkTokenActive();
      if (statusToken.status) {
        const responseApi = await transactionStatus(
          orderId,
          statusToken.cookieToken
        );
        if (responseApi.status === 429 || responseApi.status === 500) {
          
          setMessageNow(responseApi.message);
          setStatusTransaction(responseApi.status.toString());
          toast({
            variant: "destructive",
            title: "Cek Status",
            description: responseApi.message,
          });
        } else {
          toast({
            title: "Transaction: " + responseApi.data.transaction_status,
            description: responseApi.message,
          });
          setStatusTransaction(responseApi.data.transaction_status);
        }
        setapiTransactionStatus(responseApi);
        
      } else {
        setError("Authentication not found. Please log in.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData(orderId);
  }, [orderId, fetchData]); // Menambahkan fetchData sebagai dependensi

  useEffect(() => {
    const initializeFcm = async () => {
        if (isInitialized.current) return; // Jika sudah diinisialisasi, hentikan

        if (typeof window !== "undefined") { // Pastikan hanya berjalan di client
            const hasPermission = await requestNotificationPermission();
            if (hasPermission && !cachedToken.current) {
                const token = await getFcmToken();
                cachedToken.current = token; // Cache token
            }

            // Listener untuk pesan notifikasi
            onMessageListener().then((payload) => {
                console.log("Pesan notifikasi diterima:", payload);
            });

            isInitialized.current = true; // Tandai sebagai sudah diinisialisasi
        }
    };

    initializeFcm();
  }, []); // Dependency array kosong memastikan ini hanya dijalankan sekali

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `VA ${text} has been copied successfully!`,
      });
    }).catch((err) => {
      console.error("Failed to copy text: ", err);
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Unable to copy VA to clipboard. Please try again.",
      });
    });
  };

  const handleOpenApp = (url: string) => {
    window.location.href = url; // Open the GoPay app link
  };

  const handleCekStatus = (orderId:string) => {
    setOnClickLoadingStatus(true);
    setTimeout(() => {
      setOnClickLoadingStatus(false);
      fetchData(orderId);
    }, 500);
  }

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
                    <div className="flex flex-col items-center border-b-2 pb-3 dark:bg-slate-800 rounded-t-lg">
                      <div className={`flex items-center keterangan leading-3 p-3 ${statusTransaction !== "settlement" && statusTransaction !== "failed" ? null : null}`}>
                        {
                          statusTransaction === '429'
                          ? <IconPaymentLoadingDogy/>
                          : statusTransaction === 'expire'
                          ? <IconTimesUp/>
                          : apiTransactionStatus && statusTransaction === 'pending'
                          ? <IconPaymentLoadingDogy/>
                          : statusTransaction === 'settlement'
                          ? <IconPaymentSuccess/>
                          : messageNow && messageNow === 'Unexpected error occurred in getTransactionStatus'
                          ? <TransactionSkeleton/>
                          : <IconError/>
                        }
                      </div>
                        <div className="text_header flex flex-col items-center text-center leading-0">
                          {
                            statusTransaction === '429'
                            ? <p className="font-bold text-[10px]">Tunggu Beberapa Saat</p>
                            : statusTransaction === 'expire'
                            ? <p className="font-bold text-[10px]">Melebihi Batas Waktu</p>
                            : statusTransaction === 'pending'
                            ? <p className="font-bold text-[10px]">Pembayaran Aktif</p>
                            : statusTransaction === 'settlement'
                            ? <p className="font-bold text-[10px]">Pembayaran Berhasil</p>
                            : <p className="font-bold text-[10px]">{
                              messageNow && messageNow === 'Unexpected error occurred in getTransactionStatus' 
                              ? `Not Found` : messageNow
                            }</p>
                          }
                          {
                            statusTransaction === '429'
                            ? <small className="text-[9px]">Tunggu beberapa saat untuk melihat status transaksi</small>
                            : statusTransaction === 'expire'
                            ? <small className="text-[9px]">Pembayaran gagal karena melebihi batas waktu</small>
                            : statusTransaction === 'pending'
                            ? <small className="text-[9px]">Menunggu dan siap dilakukan pembayaran</small>
                            : statusTransaction === 'settlement'
                            ? <small className="text-[9px]">Terimakasih telah melakukan pembayaran</small>
                            : <small className="text-[9px]">{
                                messageNow && messageNow === 'Unexpected error occurred in getTransactionStatus' 
                                ? `Status transaksi ${orderId} tidak tersedia` : messageNow
                              }</small>
                          }
                        </div>
                    </div>
                    <CardHeader className={`flex items-center keterangan leading-3 p-3 ${
                      apiTransactionStatus && statusTransaction !== 'pending'  ? null : 'border-b-2'
                    }`}>
                      {
                        loading 
                        ? (<CountdownSkeleton />) 
                        : apiTransactionStatus && statusTransaction === 'pending' 
                        ? (<Countdown expiryTime={apiTransactionStatus.data.expiry_time} />)
                        : null
                      }

                    </CardHeader>
                      {
                        apiTransactionStatus && statusTransaction !== '429' && statusTransaction !== '500' && !error && !loading ? (
                          <CardHeader className={`list p-3
                          ${
                            loading || apiTransactionStatus.status == 200
                            ? 'border-b-2 leading-4' : null
                          }
                          `}>
                          <div>
                            <div className="flex justify-between text-[10px]">
                                <p>Kode Transaksi</p>
                                <p>{apiTransactionStatus.data.kd_trans}</p>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <p>Order Id</p>
                                <p>{apiTransactionStatus.data.order_id}</p>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <p>Nominal</p>
                                <p>Rp {Number(apiTransactionStatus.data.gross_amount).toLocaleString("id-ID", { minimumFractionDigits: 0 })}</p>
                            </div>
                            <div className="flex justify-between text-[10px]">
                              <p>
                                {
                                  apiTransactionStatus.data.payment_type === 'bank_transfer' ? 'Bank Transfer' : apiTransactionStatus.data.payment_type
                                }
                              </p>
                              <p> 
                                {
                                  apiTransactionStatus.data.payment_type === 'bank_transfer'
                                  ? apiTransactionStatus.data.va?.[0]?.bank || 'Bank name unavailable'
                                  : apiTransactionStatus.data.payment_type
                                }
                              </p>
                            </div>
                            <div className="items-center leading-3 text-[10px] mt-5">
                              {
                                apiTransactionStatus.data.payment_type === 'bank_transfer'
                                ? (
                                  <div className="flex justify-between ">
                                    <p>VA</p>
                                    <div className="flex items-center gap-2">
                                      <p  className="cursor-pointer" onClick={() => handleCopy(
                                        String(apiTransactionStatus.data.va?.[0]?.va_number)
                                      )}>{apiTransactionStatus.data.va?.[0]?.va_number}</p>
                                      <CopyIcon className="cursor-pointer w-4" onClick={() => handleCopy(String(apiTransactionStatus.data.va?.[0]?.va_number))}/>
                                    </div>
                                  </div>
                                )
                                : null
                              }
                              {
                                apiTransactionStatus.data.actions?.map((item, index)=>(
                                  item.name === 'generate-qr-code' || item.name === 'deeplink-redirect' ? 
                                    <div className="flex justify-between" key={index}>
                                      <p></p>
                                      <div className="flex items-center gap-2">
                                        {
                                          item.name === 'generate-qr-code' 
                                          ? (
                                            <p className="cursor-pointer text-[9px]"
                                              onClick={() => {
                                                setShowQrDialog(true)
                                                setQrCodeUrl(item.url);
                                              }}
                                            >SCAN QR CODE</p>
                                          ) : 
                                          item.name === 'deeplink-redirect' 
                                          ? (
                                            <p className="cursor-pointer text-[9px]"
                                              onClick={() => handleOpenApp(item.url)}
                                            >BUKA APLIKASI GOPAY</p>
                                          ) : null
                                        }  
                                        {
                                          item.name === 'generate-qr-code' 
                                          ? <QrCode
                                              className="cursor-pointer w-3"
                                              onClick={() => {
                                                setShowQrDialog(true)
                                                setQrCodeUrl(item.url);
                                              }}
                                            /> 
                                          : 
                                          item.name === 'deeplink-redirect' 
                                          ? <Smartphone
                                              className="cursor-pointer w-3"
                                              onClick={() => handleOpenApp(item.url)}
                                            /> 
                                          : null
                                        }
                                      </div>
                                    </div>
                                  : null
                                  
                                ))
                              }
                            </div>
                          </div>
                          </CardHeader>
                        ) : (
                          <CardHeader className="text-center items-center">
                            <IconLoading/>
                          </CardHeader>
                        )
                      }
                      
                      <CardFooter className={`p-3 dark:bg-slate-800 border-b-2 ${!apiTransactionStatus ? 'rounded-b-lg': null}`}>
                        <div className="flex flex-col justify-start text-xs gap-2">
                            <p>STATUS : </p>
                            <div 
                              className={`font-thi ${
                                statusTransaction === 'pending' 
                                || statusTransaction === 'accept' 
                                || statusTransaction === 'settlement'
                              }`}
                            >
                              {
                                statusTransaction === '429'
                                ? <p className="font-bold text-[10px]">{messageNow}</p>
                                : statusTransaction === 'expire'
                                ? <p className="font-bold text-[10px]">Pembayaran tidak dapat dilakukan karena melebihi batas waktu yang ditentukan</p>
                                : statusTransaction === 'pending'
                                ? <p className="font-bold text-[10px]">Menunggu pembayaran</p>
                                : statusTransaction === 'settlement'
                                ? <p className="font-bold text-[10px]">Pembayaran Berhasil</p>
                                : <p className="font-bold text-[10px]">{
                                  messageNow && messageNow === 'Unexpected error occurred in getTransactionStatus' 
                                  ? `Status transaksi ${orderId} tidak tersedia` : messageNow
                                }</p>
                              }
                            </div>
                        </div>
                      </CardFooter>
                      {apiTransactionStatus ? (
                        <CardFooter className="justify-between p-3 rounded-b-lg gap-2 border-b-2">
                          <Button className="text-xs w-full h-8 bg-purple-800 text-white"
                            onClick={()=>{handleCekStatus(orderId)}}
                          >
                            {onClickLoadingStatus ? (
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
                                  "CEK STATUS"
                              )}
                          </Button>
                        </CardFooter>
                      ) : null}
                  </Card>
              </motion.div>
          </Card>
      </div>

      {/* QR Code Dialog */}
      {showQrDialog && qrCodeUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg max-w-xs w-full text-center items-center"
          >
            <h3 className="text-sm font-bold mb-4 max-w-[250px]">SCAN QR CODE BERIKUT MENGGUNAKAN APLIKASI GOPAY</h3>
              <Image
                src={qrCodeUrl} // Dynamically set QR code URL
                alt="QR Code"
                width={200} // Width in pixels
                height={200} // Height in pixels
                objectFit="contain" // Maintains aspect ratio
                priority // Improves loading for above-the-fold content
              />
            <Button
              className="mt-4 bg-red-500 text-white"
              onClick={() => setShowQrDialog(false)}
            >
              Close
            </Button>
          </motion.div>
        </div>
      )}
  </div>
  )
}

export default StatusPayment

