import { formatDateTime } from "@/lib/date-time";
import { Button } from "../components/ui/button";
import { useEffect, useState, useMemo } from "react";
import { detailPaymentComponent } from "@/api/payment-detail";
import { PaymentResponse } from "@/interface/payment-detail-page";
import TransactionSkeleton from "./skeleton-transaction";
import { useRouter } from "next/navigation";
import { usePaymentOption } from "@/context/payment-option-context";

type DetailOption = {
  kd_trans: string;
  tanggal_bayar: string;
  metode_bayar: string;
};

type DetailPayment = {
  kode_komponen: number;
  nama_komponen: string;
  jatuh_tempo: string;
  nominal_bayar?: number;
  total_bayar?: number;
  terbayar: number;
  sisa: number;
  status: string;
  kd_trans?: string;
  tanggal_bayar?: string;
  metode_bayar?: string;
  detail_option?: DetailOption[];
};

type PropsData = {
  detail: DetailPayment;
};

type UserDataType = {
  user: {
    nis: string;
    kdRombel: string;
    namaSiswa: string;
    token: string;
    exp: number;
  };
};

const CardDetailComponent = ({
  data,
  user,
}: {
  data: PropsData;
  user: UserDataType;
}) => {
  const [detailPayment, setDetailPayment] = useState<PaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setSharedDataPaymentOption } = usePaymentOption();
  const [remainingAmount, setRemainingAmount] = useState<number>(0);
  const [kdKomponen, setKdKomponen] = useState<number>(0);
  const [namaKomponen, setNamaKomponen] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>("");
  const [onClickLoading, setOnClickLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data langsung dari API
        const response = await detailPaymentComponent(
          user.user.nis,
          user.user.kdRombel,
          `${data.detail.kode_komponen}`,
          user.user.token
        );
  
        if (!response) {
          throw new Error("Failed to fetch payment details.");
        }
  
        setDetailPayment(response);
        setKdKomponen(data.detail.kode_komponen);
        setNamaKomponen(data.detail.nama_komponen);
        setRemainingAmount(response.remainingAmount);
        setDueDate(response.jatuhTempo);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
    
    // Cegah refresh halaman
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave this page?";

      // Arahkan ke halaman sebelumnya menggunakan router
      router.back();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [data, user, router]);
  

  const paymentData = useMemo(() => {
    if (remainingAmount > 0) {
      const component = {
        kd_komponen: kdKomponen,
        nama_komponen: namaKomponen,
        nominal_harus_dibayar: remainingAmount,
      };

      const authPayload = {
        NAMASISWA: user.user.namaSiswa,
        exp: user.user.exp,
        KDROMBEL: user.user.kdRombel,
        data: user.user.nis,
      };

      return {
        auth: {
          status: true,
          data: authPayload,
          cookieToken: user.user.token,
        },
        selectedComponents: [component],
      };
    }
    return null;
  }, [remainingAmount, kdKomponen, namaKomponen, user]);

  useEffect(() => {
    if (paymentData) {
      setSharedDataPaymentOption(paymentData);
    }
  }, [paymentData, setSharedDataPaymentOption]);

  const handlePayNow = () => {
    setOnClickLoading(true);
    setTimeout(() => {
      setOnClickLoading(false);
      router.push("/payment-option");
    }, 500);
  };

  if (loading) {
    return <TransactionSkeleton />;
  }

  if (error) {
    return (<div className="text-red-500 text-[10px]">
      <p>{error}</p>
      <p className="mt-5">Jika anda melihat pesan error ini ketika melakukan refresh, silahkan kembali ke halaman sebelumnya dan pilih komponen pembayaran ulang</p>
    </div>)
  }

  if (!detailPayment || !detailPayment.payments) {
    return <p className="text-red-500 text-[10px]">Payment data is not available.</p>;
  }
  
  return (
    <>
      <div className="keterangan leading-4">
        <div className="flex justify-between text-[10px]">
          <p>Component</p>
          <p>{data.detail.nama_komponen}</p>
        </div>
        <div className="flex justify-between text-[10px]">
          <p>Nominal</p>
          <p>
            {data.detail.status === "LUNAS"
              ? new Intl.NumberFormat("id-ID").format(data.detail.terbayar)
              : new Intl.NumberFormat("id-ID").format(data.detail.total_bayar ?? 0)}
          </p>
        </div>
        <div className="flex justify-between text-[10px]">
          <p>Due date</p>
          <p>{formatDateTime(data.detail.jatuh_tempo ?? dueDate).date}</p>
        </div>
      </div>

      <div className="mt-3">
      {data.detail.status === "BELUM DIBAYAR" ? (
        <div className="flex justify-center items-center mt-5">
          <div className="w-full">
              <Button className="text-xs w-full h-8 bg-purple-800 text-white" onClick={handlePayNow}>
                {onClickLoading ? (
                  <>
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    Loading
                  </>
                  
                  ) : (
                    "Bayar Sekarang"
                )}
              </Button>
            </div>
        </div>
      ) : (
        <div className="detail transaction text-[10px]">
          <div className="flex flex-col mt-2">
            <p>Payment transaction list:</p>
            {detailPayment.payments.length > 0 ? (
              detailPayment.payments.map((group, index) => (
                <div key={index}>
                  {group.paymentGroups.map((group2, index2) => (
                    <div key={index2} className="list mt-2 leading-4">
                      <p>
                        {formatDateTime(
                          group2.installments[0]?.payment_core?.tanggal_bayar ?? ""
                        ).date}
                      </p>
                      <div className="flex justify-between">
                        <p>{group2.kdTrans}</p>
                        <p>
                          {new Intl.NumberFormat("id-ID").format(group2.totalPaid)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p>No payment groups available.</p>
            )}
            <div className="flex items-end justify-end mt-2 rounded-md">
              <p>
                {detailPayment.remainingAmount > 0
                  ? "PEMBAYARAN : BELUM LUNAS"
                  : "PEMBAYARAN : LUNAS"}
              </p>
            </div>
            {detailPayment.remainingAmount > 0 && (
              <>
                <div className="flex justify-between mb-3">
                  <p>Insufficient</p>
                  <p>
                    {new Intl.NumberFormat("id-ID").format(
                      detailPayment.remainingAmount
                    )}
                  </p>
                </div>
                <div className="action-payment mt-2 dark:bg-slate-800">
                  <Button
                    className="text-xs w-full h-8 bg-purple-800 text-white"
                    onClick={handlePayNow}
                  >
                    {onClickLoading ? (
                    <>
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      Loading
                    </>
                    ) : (
                      "Bayar Sekarang"
                  )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      </div>
    </>
  );
};

export default CardDetailComponent;
