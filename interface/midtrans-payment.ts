// Interface untuk bagian "va"
interface VirtualAccount {
    bank: string;
    va_number: string;
}
  
// Interface untuk bagian "details"
interface PaymentDetail {
    id: number;
    kd_trans: string;
    comp_bayar_id: number;
    nominal_bayar: number;
    status: number;
    created_at: string;
    updated_at: string;
}
  
// Interface untuk bagian "actions"
interface Action {
    name: string;
    method: string;
    url: string;
}
  
// Interface utama untuk respons
export interface ApiResponse {
    status: number;
    message: string;
    data: {
      status_code: number | string;
      status_message: string;
      transaction_id: string;
      order_id: string;
      gross_amount: string;
      payment_type: string;
      transaction_time: string;
      transaction_status: string;
      expiry_time: string;
      kd_trans: string;
      va?: VirtualAccount[];
      actions?: Action[];
      details: PaymentDetail[];
    };
}
  