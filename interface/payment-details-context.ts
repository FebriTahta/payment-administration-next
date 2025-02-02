// import { ComponentList } from "@/interface/payment-list-page"
type DetailPayment = {
  kode_komponen: number,
  nama_komponen: string,
  jatuh_tempo: string,
  nominal_bayar?: number,
  total_bayar?: number,
  terbayar: number,
  sisa: number,
  status: string,
  kd_trans?: string,
  tanggal_bayar?: string,
  metode_bayar?: string
}

export interface PaymentDetailContextType {
  sharedData: DetailPayment | null; // Data bisa null secara default
  setSharedData: React.Dispatch<React.SetStateAction<DetailPayment | null>>;
}

export interface DetailOption {
  payment_core: {
    kd_trans?: string,
    tanggal_bayar?: string,
    metode_bayar?: string
  }
}

export interface DetailDataContext {
  kode_komponen: number,
  nama_komponen: string,
  jatuh_tempo: string,
  total_bayar: number, // pembayaran yang seharusnya / full payment
  terbayar: number,
  sisa: number,
  status: string,
  detail_option?: DetailOption[]
}