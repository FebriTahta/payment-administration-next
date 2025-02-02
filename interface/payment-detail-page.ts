export type PaymentResponse = {
  id: number;
  namaKomponen: string;
  jatuhTempo: string;
  totalBayar: number;
  kelas: string;
  jurusan: string;
  payments: PaymentDetails[];
  remainingAmount: number;
};

export interface PaymentDetails {
  totalPaid: number;
  paymentGroups: PaymentGroup[];
}

export interface PaymentGroup {
  kdTrans: string;
  totalPaid: number;
  installments: Installment[];
}

export interface Installment {
  id: number;
  kd_trans: string;
  comp_bayar_id: number;
  nominal_bayar: number;
  status: number;
  created_at: string;
  updated_at: string;
  payment_core: PaymentCore;
}

export interface PaymentCore {
  id: number;
  kd_trans: string;
  nis: string;
  tanggal_bayar: string;
  total_bayar: number;
  keterangan: string | null;
  created_by: string;
  updated_by: string | null;
  kategori: string;
  metode_bayar: string;
  status: number;
  created_at: string;
  updated_at: string;
  siswa: StudentDetails;
}

export interface StudentDetails {
  NIS: string;
  NAMASISWA: string;
  GENDER: string;
  TINGKAT: number;
  KDROMBEL: string;
  STATUSAKADEMIK: string;
}