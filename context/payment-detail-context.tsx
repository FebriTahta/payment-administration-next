'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from "react";

type DetailOption = {
  kd_trans: string;
  tanggal_bayar: string;
  metode_bayar: string;
};

type DetailPayment = {
  kode_komponen: number;
  nama_komponen: string;
  jatuh_tempo: string;
  total_bayar: number;
  terbayar: number;
  sisa: number;
  status: string;
  detail_option: DetailOption[];
};

interface PaymentDetailContextType {
  sharedData: DetailPayment | null;
  setSharedData: React.Dispatch<React.SetStateAction<DetailPayment | null>>;
}

const PaymentDetailContext = createContext<PaymentDetailContextType | undefined>(undefined);

export const PaymentDetailProvider = ({ children }: { children: ReactNode }) => {
  const [sharedData, setSharedData] = useState<DetailPayment | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("paymentDetail");
      if (storedData) {
        setSharedData(JSON.parse(storedData));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && sharedData) {
      localStorage.setItem("paymentDetail", JSON.stringify(sharedData));
    }
  }, [sharedData]);

  return (
    <PaymentDetailContext.Provider value={{ sharedData, setSharedData }}>
      {children}
    </PaymentDetailContext.Provider>
  );
};

export const usePaymentDetail = (): PaymentDetailContextType => {
  const context = useContext(PaymentDetailContext);

  if (!context) {
    throw new Error("usePaymentDetail must be used within a PaymentDetailProvider");
  }

  return context;
};
