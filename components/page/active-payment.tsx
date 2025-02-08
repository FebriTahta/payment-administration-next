'use client'
import { motion } from "framer-motion";
import { Card, CardFooter, CardHeader } from "../ui/card";
import IconPaymentLoadingDogy from "../icon/icon_payment_loading_dogy";
import Countdown from "@/components/Countdown";
import { useToast } from "@/hooks/use-toast";
import { CopyIcon, QrCode, Smartphone } from "lucide-react";
import { Button } from "../ui/button";
import { activePayment } from "@/api/active-payment";
import { checkTokenActive } from '@/lib/jwt';
import { useState, useEffect, useRef } from 'react';
import { ApiResponse } from "@/interface/midtrans-payment";
import TransactionSkeleton from "../skeleton-transaction";
import CountdownSkeleton from "../skeleton-countdown";
import IconLoading from "../icon/icon_loading";
import { getFcmToken, onMessageListener, requestNotificationPermission } from "@/utils/fcm-notification";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import Icon404 from "../icon/icon_404";
import { createFcmWebToken } from "@/api/create-fcm-web-token";
import { cancelTransaction } from "@/api/cancel-transaction";

const ActivePayment = () => {

  const { toast } = useToast();
  const [apiActivePayment, setapiActivePayment] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusTransaction, setStatusTransaction] = useState("");
  const [showQrDialog, setShowQrDialog] = useState(false); // State for QR dialog
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null); // State for dynamic QR code URL
  const isInitialized = useRef(false); // Untuk mencegah pemanggilan ulang
  const cachedToken = useRef<string | null>(null);
  const [onClickLoadingStatus, setOnClickLoadingStatus] = useState(false);
  const [onClickLoadingCancel, setOnClickLoadingCancel] = useState(false);
  const [token, setToken] = useState<string>('');
  const [nis, setNis] = useState<string>('');
  const router = useRouter();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
          const statusToken = checkTokenActive();
          if (statusToken.status) {
              const responseApi = await activePayment(
                  statusToken.data?.data || '', 
                  statusToken.data?.KDROMBEL || '-', 
                  statusToken.cookieToken || ''
              );
              setapiActivePayment(responseApi);
              setStatusTransaction(responseApi.data.transaction_status);
              setToken(statusToken.cookieToken || '');
              setNis(statusToken.data.data);
              
          } else {
              setError('Authentication not found. Please log in.');
          }
      } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to fetch data.');
      } finally {
          setLoading(false);
      }
    }

    fetchData();
  }, []);

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
  

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `VA ${text} has been copied successfully!`,
      });
    }).catch((err) => {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Copy failed",
        description: "Unable to copy VA to clipboard. Please try again.",
      });
    });
  };

  const handleOpenApp = (url: string) => {
    window.location.href = url; // Open the GoPay app link
  };

  const handleCekStatus = async (order_id: string) => {
    setOnClickLoadingStatus(true);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setOnClickLoadingStatus(false);
    router.push(`/status-payment/${order_id}`);
  };
  

  const handleCancel = async (order_id:string) => {
    setOnClickLoadingCancel(true);
    try {
      await cancelTransaction({orderId:order_id}, token);
      toast({
        title: 'Cancel Payment',
        description: 'Pembayaran aktif telah diurungkan',
      });
      router.push(`/home-page`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch data.');
    }
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
                          <IconPaymentLoadingDogy/>
                          <div className="text_header flex flex-col items-center text-center leading-0">
                              <p className="font-bold text-[10px]">{!apiActivePayment ? "Ingin Melakukan Pembayaran ?" : "Menunggu Pembayaran"}</p>
                              <small className="text-[9px]">{!apiActivePayment ? "Pilih komponen pembayaran terlebih dahulu" : "Pembayaran Aktif Siap Dibayar"}</small>
                          </div>
                      </div>
                      <CardHeader className="flex items-center keterangan leading-3 p-3 border-b-2">
                      {
                        loading 
                        ? (<CountdownSkeleton />) 
                        : apiActivePayment && apiActivePayment.status == 200 
                        ? (<Countdown expiryTime={apiActivePayment.data.expiry_time} />)
                        : (<IconLoading />)
                      }
                      </CardHeader>
                      {
                        apiActivePayment ? (
                          <CardHeader className="list p-3 border-b-2">
                            {
                              loading || error || apiActivePayment?.status !== 200
                              ? (
                                <TransactionSkeleton/>
                              )
                              : (
                                <div>
                                  <div className="flex justify-between text-[10px]">
                                      <p>Kode Transaksi</p>
                                      <p>{apiActivePayment.data.kd_trans}</p>
                                  </div>
                                  <div className="flex justify-between text-[10px]">
                                      <p>Order Id</p>
                                      <p>{apiActivePayment.data.order_id}</p>
                                  </div>
                                  <div className="flex justify-between text-[10px]">
                                      <p>Nominal</p>
                                      <p>Rp {Number(apiActivePayment.data.gross_amount).toLocaleString("id-ID", { minimumFractionDigits: 0 })}</p>
                                  </div>
                                  <div className="flex justify-between text-[10px]">
                                    <p>
                                      {
                                        apiActivePayment.data.payment_type === 'bank_transfer' ? 'Bank Transfer' : apiActivePayment.data.payment_type
                                      }
                                    </p>
                                    <p> 
                                      {
                                        apiActivePayment.data.payment_type === 'bank_transfer'
                                        ? apiActivePayment.data.va?.[0]?.bank || 'Bank name unavailable'
                                        : apiActivePayment.data.payment_type
                                      }
                                    </p>
                                  </div>
                                  <div className="items-center leading-3 text-[10px] mt-5">
                                    {
                                      apiActivePayment.data.payment_type === 'bank_transfer'
                                      ? (
                                        <div className="flex justify-between ">
                                          <p>VA</p>
                                          <div className="flex items-center gap-2">
                                            <p  className="cursor-pointer" onClick={() => handleCopy(
                                              String(apiActivePayment.data.va?.[0]?.va_number)
                                            )}>{apiActivePayment.data.va?.[0]?.va_number}</p>
                                            <CopyIcon className="cursor-pointer w-4" onClick={() => handleCopy(String(apiActivePayment.data.va?.[0]?.va_number))}/>
                                          </div>
                                        </div>
                                      )
                                      : null
                                    }
                                    {
                                      apiActivePayment.data.actions?.map((item, index)=>(
                                        item.name === 'generate-qr-code' || item.name === 'deeplink-redirect' ? 
                                          <div className="flex justify-end" key={index}>
                                            <div className="flex items-center gap-1">
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
                              )
                            }
                            
                          </CardHeader>
                        ) : null
                      }
                      
                      <CardFooter className={`p-3 dark:bg-slate-800 border-b-2 ${!apiActivePayment ? 'rounded-b-lg': null}`}>
                        <div className="flex flex-col justify-start text-[10px] gap-2">
                            <p>STATUS : </p>
                            <div 
                              className={`font-thin text-[10px] ${
                                statusTransaction === 'pending' 
                                || statusTransaction === 'accept' 
                                || statusTransaction === 'settlement'
                              }`}
                            >{!apiActivePayment 
                              ? (
                                <div className="flex flex-col">
                                  <p>Belum ada pembayaran yang dipilih</p>
                                  <p>Pilih komponen pembayaran terlebih dahulu</p>
                                </div>
                              ) 
                              : (
                                <p>
                                   Pembayaran {statusTransaction}
                                </p>
                              )}
                            </div>
                        </div>
                      </CardFooter>
                      {apiActivePayment ? (
                        <CardFooter className="justify-between p-3 rounded-b-lg gap-2 border-b-2">
                          <Button className="text-[10px] w-full h-8 bg-slate-500 text-white"
                            onClick={()=>{handleCancel(apiActivePayment.data.order_id)}}
                          >
                          {onClickLoadingCancel ? (
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
                                  "CANCEL"
                              )}
                          </Button>
                          <Button className="text-[10px] w-full h-8 bg-purple-800 text-white"
                            onClick={()=>{handleCekStatus(apiActivePayment.data.order_id)}}
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
            <h3 className="text-sm font-bold mb-2 max-w-[250px]">SCAN QR CODE BERIKUT MENGGUNAKAN APLIKASI GOPAY</h3>
              <Image
                src={qrCodeUrl} // Dynamically set QR code URL
                alt="QR Code"
                width={200} // Width in pixels
                height={200} // Height in pixels
                objectFit="contain" // Maintains aspect ratio
                priority // Improves loading for above-the-fold content
              />
            <Button
              className="mt-2 bg-red-500 text-white"
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

export default ActivePayment

