// app/status-payment/[code-transaction]/page.tsx
"use client"
import { useParams } from 'next/navigation';
import StatusPayment from '@/components/page/status-payment';

export default function StatusPaymentPage() {
  const params = useParams(); 
 // Pastikan 'orderId' adalah string (atau fallback ke string kosong jika undefined)
 const orderId = Array.isArray(params['code-transaction']) ? params['code-transaction'][0] : params['code-transaction'] || "";

  return (
    <>
      <StatusPayment orderId={orderId}/>
    </>
  );
}
