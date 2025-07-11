export interface PaymentList {
    tra_bayar_dtl_id: number;
    kd_trans: string;
    tanggal_bayar: string;
    metode_bayar: string;
    nis: string;
    nama_siswa: string;
    kd_rombel: string;
    kode_komponen: number;
    nama_komponen: string;
    jatuh_tempo: string;
    nominal_bayar: number;
    terbayar: number;
    sisa: number;
    status: string;
    ontime: number;
    paidoff: number;
    created_at: string;
    updated_at: string;
}
  
export interface MonthlyRecapPaymentResponse {
    status: number;
    message: string;
    data: {
        payment_list: PaymentList[];
        total_payment: number;
    };
}

export interface AuthPayload {
    NAMASISWA: string | undefined;
    exp: number;
    KDROMBEL: string;
    TAHUN_AJARAN:string;
    data: string;
}
  