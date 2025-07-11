interface PaymentCore {
    kd_trans?: string;
    tanggal_bayar?: string;
    metode_bayar?: string;
    siswa?: {
      NAMASISWA?: string;
      KDROMBEL?: string;
      NIS?: string;
    };
  }
  
  interface ComponentDetail {
    id?: number;
    kd_trans?: string;
    comp_bayar_id?: number;
    nominal_bayar?: number;
    status?: number;
    created_at?: string;
    updated_at?: string;
    payment_core?: PaymentCore;
  }
  
 export interface ComponentList {
    kode_komponen: number;
    nama_komponen: string;
    jatuh_tempo: string;
    total_bayar: number;
    terbayar: number;
    sisa: number;
    status: string;
    details: ComponentDetail[];
    kd_trans?: string;
    tanggal_bayar?: string;
    metode_bayar?: string;
  }
  
  export interface AvailablePaymentComponentsResponse {
    status: number;
    message: string;
    data: {
      component_list: ComponentList[];
    };
  }
  
  export interface AvailabelPaymentComponentsPageProps {
    props: {
      title: string;
      desc: string;
      nis: string;
      kd_rombel: string;
      payment_type: string;
      i_pay: string;
      token: string;
      tahun_ajaran: string;
    };
  }
  