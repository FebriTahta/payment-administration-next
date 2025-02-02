import { Suspense } from 'react';
import PaymentComponentList from "@/components/page/payment-component-list";

interface SearchParams {
  payment_type?: string;
  i_pay?: string;
  nis?: string;
  kd_rombel?: string;
  token?: string;
}

const fetchPaymentDetails = async (searchParams: SearchParams) => {
  const payment_type = decodeURIComponent(atob(searchParams.payment_type || '-'));
  const i_pay = searchParams.i_pay || 'List';
  const nis = decodeURIComponent(atob(searchParams.nis || '-'));
  const kd_rombel = decodeURIComponent(atob(searchParams.kd_rombel || '-'));
  const token = decodeURIComponent(atob(searchParams.token || '-'));

  return {
    title: `Tipe Pembayaran : ${payment_type.toUpperCase()}`,
    desc: "Lakukan pembayaran sebelum jatuh tempo",
    nis,
    kd_rombel,
    payment_type,
    i_pay,
    token,
  };
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const typedSearchParams: SearchParams = {
    payment_type: resolvedSearchParams.payment_type as string | undefined,
    i_pay: resolvedSearchParams.i_pay as string | undefined,
    nis: resolvedSearchParams.nis as string | undefined,
    kd_rombel: resolvedSearchParams.kd_rombel as string | undefined,
    token: resolvedSearchParams.token as string | undefined,
  };

  const props = await fetchPaymentDetails(typedSearchParams);
  console.log(resolvedSearchParams.i_pay);
  
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentComponentList props={props} />
    </Suspense>
  );
}

