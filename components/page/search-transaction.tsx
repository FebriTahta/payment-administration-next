'use client'
import { useSearchData } from "@/context/search-context";
import { useEffect, useState } from "react";
import { Card, CardFooter, CardHeader } from "../ui/card";
import { motion } from "framer-motion";
import IconTimesUp from "../icon/icon_timesup";
import IconPaymentLoadingDogy from "../icon/icon_payment_loading_dogy";
import IconPaymentSuccess from "../icon/icon_payment_success";
import IconError from "../icon/icon_error";
import { CopyIcon, QrCode, Smartphone } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";


const SearchTransactionComponent = () => {

    const router = useRouter();
    const { sharedSearchData } = useSearchData();
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null); // State for dynamic QR code URL
    const [showQrDialog, setShowQrDialog] = useState(false); // State for QR dialog

    useEffect(() => {
        // console.log(sharedSearchData);
    }, [sharedSearchData]);

    if (!sharedSearchData) {
        return
    }

    const handleBackToHome = () => {
        router.push('/home-page');
    }

    const handleOpenApp = (url: string) => {
        window.location.href = url; // Open the GoPay app link
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
                            <CardHeader className="flex items-center border-b-2 pb-3 dark:bg-slate-800 rounded-t-lg">
                            
                            { 
                                sharedSearchData.transaction_status == 'expire' 
                                ? <IconTimesUp/>
                                : sharedSearchData.transaction_status == 'pending'
                                ? <IconPaymentLoadingDogy/>
                                : sharedSearchData.transaction_status == 'settlement'
                                ? <IconPaymentSuccess/>
                                : sharedSearchData.transaction_status == 'accept'
                                ? <IconPaymentSuccess/>
                                : <IconError/>
                            }

                            <div className="text_header text-center leading-0">
                                {
                                    sharedSearchData.transaction_status == 'expire' 
                                    ? (
                                        <div className="flex flex-col items-center">
                                            <p className="font-bold text-sm">Pembayaran Expired</p>
                                            <small className="text-xs">Pembayaran transaksi tidak dapat dilanjutkan</small>
                                        </div>
                                    )
                                    : sharedSearchData.transaction_status == 'pending' 
                                    ? (
                                        <div className="flex flex-col items-center">
                                            <p className="font-bold text-sm">Pembayaran Aktif</p>
                                            <small className="text-xs">Menunggu dan siap dilakukan pembayaran</small>
                                        </div>
                                    )
                                    : sharedSearchData.transaction_status == 'settlement'
                                    ? (
                                        <div className="flex flex-col items-center">
                                            <p className="font-bold text-sm">Pembayaran Berhasil</p>
                                            <small className="text-xs">Terimakasih telah melakukan pembayaran</small>
                                        </div>
                                    )
                                    : sharedSearchData.transaction_status == 'accept'
                                    ? (
                                        <div className="flex flex-col items-center">
                                            <p className="font-bold text-sm">Pembayaran Masuk</p>
                                            <small className="text-xs">Pembayaran masuk.. menunggu proses berhasil</small>
                                        </div>
                                    )
                                    : (
                                        <div className="flex flex-col items-center">
                                            <p className="font-bold text-sm">Pembayaran Gagal</p>
                                            <small className="text-xs">Pembayaran tidak dapat dilanjutkan</small>
                                        </div>
                                    )
                                }
                            </div>
                            </CardHeader>
                            <CardHeader className="list p-4 border-b-2">
                                <div className="flex justify-between text-xs">
                                    <p>Kode Transaksi</p>
                                    <p>{sharedSearchData.kd_trans}</p>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <p>Order Id</p>
                                    <p>{sharedSearchData.order_id}</p>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <p>Nominal</p>
                                    <p>Rp {Number(sharedSearchData.gross_amount).toLocaleString("id-ID", { minimumFractionDigits: 0 })}</p>
                                </div>
                                <div className="flex justify-between text-xs">
                                <p>
                                    {
                                    sharedSearchData.payment_type === 'bank_transfer' ? 'Bank Transfer' : sharedSearchData.payment_type
                                    }
                                </p>
                                <p> 
                                    {
                                    sharedSearchData.payment_type === 'bank_transfer'
                                    ? sharedSearchData.va.bank || 'Bank name unavailable'
                                    : sharedSearchData.payment_type
                                    }
                                </p>
                                </div>
                                <div className="items-center leading-3 text-xs mt-5">
                                {
                                    sharedSearchData.payment_type === 'bank_transfer'
                                    ? (
                                    <div className="flex justify-between ">
                                        <p>VA</p>
                                        <div className="flex items-center gap-2">
                                        <p  className="cursor-pointer" 
                                            // onClick={() => handleCopy(
                                            //     String(sharedSearchData.va.va_number)
                                            // )}
                                        >{sharedSearchData.va.va_number}</p>
                                        <CopyIcon className="cursor-pointer w-4" 
                                            // onClick={() => handleCopy(String(sharedSearchData.va.va_number))}
                                        />
                                        </div>
                                    </div>
                                    )
                                    : null
                                }
                                {
                                    sharedSearchData.actions?.map((item, index)=>(
                                    item.name === 'generate-qr-code' || item.name === 'deeplink-redirect' ? 
                                        <div className="flex justify-between" key={index}>
                                        <p></p>
                                        <div className="flex items-center gap-2">
                                            {
                                            item.name === 'generate-qr-code' 
                                            ? (
                                                <p className="cursor-pointer"
                                                onClick={() => {
                                                  setShowQrDialog(true)
                                                  setQrCodeUrl(item.url);
                                                }}
                                                >SCAN QR CODE</p>
                                            ) : 
                                            item.name === 'deeplink-redirect' 
                                            ? (
                                                <p className="cursor-pointer"
                                                // onClick={() => handleOpenApp(item.url)}
                                                >BUKA APLIKASI GOPAY</p>
                                            ) : null
                                            }  
                                            {
                                            item.name === 'generate-qr-code' 
                                            ? <QrCode
                                                className="cursor-pointer w-4"
                                                onClick={() => {
                                                  setShowQrDialog(true)
                                                  setQrCodeUrl(item.url);
                                                }}
                                                /> 
                                            : 
                                            item.name === 'deeplink-redirect' 
                                            ? <Smartphone
                                                className="cursor-pointer w-4"
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
                            </CardHeader>
                            <CardFooter className={`p-4 dark:bg-slate-800 border-b-2 'rounded-b-lg': null}`}>
                                <div className="flex flex-col justify-start text-[10px] gap-2">
                                    <p>STATUS : </p>
                                    <div 
                                    className={`font-thin text-[10px] ${
                                        sharedSearchData.transaction_status === 'pending' 
                                        || sharedSearchData.transaction_status === 'accept' 
                                        || sharedSearchData.transaction_status === 'settlement'
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                    }`}
                                    >
                                    {
                                        sharedSearchData.transaction_status === 'expire'
                                        ? <p className="font-bold text-sm">Pembayaran tidak dapat dilakukan karena melebihi batas waktu yang ditentukan</p>
                                        : sharedSearchData.transaction_status === 'pending'
                                        ? <p className="font-bold text-sm">Menunggu pembayaran</p>
                                        : sharedSearchData.transaction_status === 'settlement'
                                        ? <p className="font-bold text-sm">Pembayaran Berhasil</p>
                                        : <p className="font-bold text-sm">Pembayaran Gagal</p>
                                    }
                                    </div>
                                </div>
                            </CardFooter>
                            <CardFooter className={`p-4 dark:bg-slate-800 border-b-2 'rounded-b-lg': null}`}>
                                <div className="flex flex-col justify-start text-xs gap-2 leading-3">
                                    <small>
                                        Halaman pencarian menggunakan cache. 
                                    </small>
                                    <small>
                                        Apabila status pembayaranmu belum ter-update secara otomatis.
                                        silahkan cek pada pembayaran aktif atau pada daftar pembayaran
                                    </small>
                                </div>
                            </CardFooter>
                            <CardFooter className="justify-between p-4 rounded-b-lg gap-2 border-b-2">
                                <Button className="text-xs w-full bg-purple-800 text-white"
                                    onClick={()=>{handleBackToHome()}}
                                >
                                    Kembali Ke Halaman Utama
                                </Button>
                            </CardFooter>
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

export default SearchTransactionComponent