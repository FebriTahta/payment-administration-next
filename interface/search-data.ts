export interface TransactionAction {
    name: string;
    method: string;
    url: string;
  }
  
 export interface TransactionDetail {
    id: number;
    kd_trans: string;
    comp_bayar_id: number;
    nominal_bayar: number;
    status: number;
    created_at: string;
    updated_at: string;
  }

  export interface TransactionVA {
    va_number: string;
    bank: string;
    
  }
  
  export type TransactionData = {
    status_code: number;
    status_message: string;
    transaction_id: string;
    order_id: string;
    gross_amount: number;
    payment_type: string;
    transaction_time: string;
    transaction_status: string;
    expiry_time: string;
    kd_trans: string;
    nis: string;
    va: TransactionVA;
    actions: TransactionAction[];
    details: TransactionDetail[];
  }
  
  export interface ApiResponse {
    status: number;
    message: string;
    data: TransactionData;
  }
  