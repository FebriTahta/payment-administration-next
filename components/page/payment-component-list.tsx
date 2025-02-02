'use client'
import {motion} from "framer-motion";
import { Card, CardHeader, CardDescription, CardTitle } from "../ui/card";
import { 
  AvailabelPaymentComponentsPageProps,
  AvailablePaymentComponentsResponse,
  ComponentList
} from "@/interface/payment-component-list-page";
// import { DetailOption} from '@/interface/payment-details-context';
import { useState, useEffect } from 'react';
import CardItemBeta from "../card-item-beta";
import { availablePaymentComponents } from "@/api/payment-component-list";
import SkeletonItemCard from '../skeleton-item-card';
import { usePaymentDetail } from "@/context/payment-detail-context";
import { useRouter } from "next/navigation";

const PaymentComponentList = ({props}: AvailabelPaymentComponentsPageProps) => {

  const [paymentList, setPaymentList] = useState<AvailablePaymentComponentsResponse | null>(null);
  const [loading, setLoading] = useState(true); // loading mulai
  const [error, setError] = useState<string | null>(null);
  const {setSharedData} = usePaymentDetail();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const availablePayments = await availablePaymentComponents(
          props.nis,
          props.kd_rombel,
          props.payment_type,
          props.token
        );
        setPaymentList(availablePayments);
        setLoading(false); // Pastikan loading selesai
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(`Failed to fetch: ${errorMessage}`);
      }
    };
    fetchData();
    
  }, [props.nis, props.kd_rombel, props.payment_type, props.token]); // Tambahkan semua dependensi

  const MapToDetailContext = (item: ComponentList) => {
    return {
      kode_komponen: item.kode_komponen,
      nama_komponen: item.nama_komponen,
      jatuh_tempo: item.jatuh_tempo,
      total_bayar: item.total_bayar,
      terbayar: item.terbayar,
      sisa: item.sisa,
      status: item.status,
      detail_option: Array.isArray(item.details)
        ? item.details.map((detail) => ({
            kd_trans: detail.payment_core?.kd_trans ?? "",
            tanggal_bayar: detail.payment_core?.tanggal_bayar ?? "",
            metode_bayar: detail.payment_core?.metode_bayar ?? "",
          }))
        : [], // Default to an empty array if item.details is not valid
    };
  };

  const handleOnClick = (item: ComponentList) => {
    const detailData = MapToDetailContext(item);
    setSharedData(detailData);
    router.push('/payment-detail');
  }
  
  return (
    <div className="h-full pt-[15vh] w-screen max-w-md relative">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
         
        >
       <div className="flex flex-col mt-[2vh] items-center justify-center">
        {/* card name */}
        <Card className="flex z-50 dark:bg-slate-900 dark:bg-opacity-70">
          <CardHeader className="pt-2 pb-2">
            <CardTitle className="text-sm">{props.title}</CardTitle>
            {
              paymentList?.data.component_list.length !== 0 || error
              ? (error ? 'Error' : <CardDescription className="text-xs">{props.desc}</CardDescription>) 
              : <CardDescription className="text-xs">Komponen pembayaran tidak tersedia</CardDescription>
            }
          </CardHeader>
        </Card>
        {/* card payment component */}
        <Card className="z-20 mt-[-40px] w-full h-screen  pl-7 pr-7 rounded-[30px] dark:bg-slate-900 dark:bg-opacity-70">

          <CardHeader className="pr-5 pl-5 pt-16">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col text_left">
                <small className="text-xs">
                  {paymentList?.data.component_list.length !== 0 || error
                  ? (error ? error : `Tersedia ${paymentList?.data.component_list.length} komponen pembayaran`) 
                  : null
                  }
                </small>
              </div>
              <div className="flex flex-col items-end text_right"></div>
            </div>
          </CardHeader>
          
          <div className="overflow-y-auto pb-[env(safe-area-inset-bottom)] sm:pb-6 md:pb-8 h-[57vh] scroll-smooth">
            {loading || error || paymentList?.data.component_list.length === 0 ? (
              <div className="flex flex-col justify-center mx-4 mb-4 gap-y-2 shadow-none dark:bg-slate-900 dark:bg-opacity-70 rounded-lg">
                <SkeletonItemCard />
                {paymentList?.data.component_list.length === 0 || error ? (
                  <div className="flex justify-center shadow-none dark:bg-slate-900 dark:bg-opacity-70 rounded-lg mt-5">
                    <p className="text-red-500 text-[10px] pb-5">
                      {error ? error : '(404) Komponen Pembayaran Tidak Tersedia'}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              paymentList?.data.component_list.map((item, index) => (
                <div
                  key={index}
                  className={`${
                    index === paymentList.data.component_list.length - 1 ? '' : 'mb-4'
                  }`}
                  style={{ minHeight: '50px' }} // Opsional: Ganti nilai minHeight sesuai desain
                >
                  <CardItemBeta
                    item={item}
                    icon={{ icon: props.i_pay }}
                    click={() => handleOnClick(item)}
                  />
                </div>
              ))
            )}
            <div className="pt-[50px]"></div>
          </div>

        </Card>
      </div>
      </motion.div>
    </div>
  )
}

export default PaymentComponentList