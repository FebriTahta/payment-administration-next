'use client';
import {motion} from "framer-motion";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ButtonAddPaymentComponent } from "../button-add-payment-component";
import { checkTokenActive } from '@/lib/jwt';
import { useState, useEffect } from 'react';
import CardItemComponent from "../card-item-component";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { usePaymentOption } from "@/context/payment-option-context";


interface AuthPayload {
    NAMASISWA: string | undefined;
    exp: number;
    KDROMBEL: string;
    data: string;
}

type AuthFormat = {
    status: boolean;
    data: AuthPayload;
    cookieToken: string;
};

interface Component {
    kd_komponen: number; // atau number, sesuaikan dengan data
    nama_komponen: string;
    nominal_harus_dibayar: number;
}

type saveSelectedComponents = {
  selectedComponents: Component[]
}

type AvailablePaymentOptionResponse = {
  auth: AuthFormat;
  selectedComponents: Component[]
}

const NewPayment = () => {
    const { toast } = useToast();
    const router = useRouter();
    const [isAuth, setIsAuth] = useState<AuthFormat>();
    const [selectedComponents, setSelectedComponents] = useState<Component[]>([]);
    const [availablePayment, setAvailablePayment] = useState<Component[]>([]);
    const [onClickLoading, setOnClickLoading] = useState(false);
    const { setSharedDataPaymentOption } = usePaymentOption();

    useEffect(() => {
        try {
            const statusToken = checkTokenActive();
            if (statusToken.status) {
                setIsAuth(statusToken);
            }
        } catch (error) {
            console.error(error instanceof Error ? error.message : "Failed to fetch data.");
        }
    }, []);

    const handleAddComponent = (component: Component, nama_komponen: string) => {
        setSelectedComponents((prev) => [...prev, component]);
        setAvailablePayment((prev) => prev.filter((item) => item.kd_komponen !== component.kd_komponen));
        toast({
          title: "Success Added",
          description:  nama_komponen,
        });
    };

    // Fungsi untuk menangani data dari API yang diteruskan dari ButtonAddPaymentComponent
    const handleAvailablePayment = (paymentData: Component[]) => {
        setAvailablePayment(paymentData); // Menyimpan data yang diteruskan dari komponen anak
    };

    const handleRemoveComponent = (kodeKomponen: number, namaKomponen: string) => {
        const removedComponent = selectedComponents.find(
            (component) => component.kd_komponen === kodeKomponen
        );

        setSelectedComponents((prev) =>
            prev.filter((component) => component.kd_komponen !== kodeKomponen)
        );

        if (removedComponent) {
            setAvailablePayment((prev) => [...prev, removedComponent]);
        }

        toast({
          title: "Success Removed",
          description:  namaKomponen,
        });
    };

    const handlePay = ({selectedComponents}:saveSelectedComponents) => {
      
      if (!isAuth) {
        toast({
          title: "Authentication Error",
          description: "User is not authenticated.",
        });
        return;
      }

      setOnClickLoading(true); // Set loading to true saat tombol ditekan
      
      const paymentData: AvailablePaymentOptionResponse = {
        auth: isAuth, // Safe to use now
        selectedComponents,
      };
    
      setSharedDataPaymentOption(paymentData);

      setTimeout(() => {
        setOnClickLoading(false); // Set loading ke false setelah pembayaran selesai (disimulasikan 3 detik)
        router.push('/payment-option');
      }, 1000);
    }

    // Menghitung total nominal yang harus dibayar
    const totalNominal = selectedComponents.reduce((total, component) => total + component.nominal_harus_dibayar, 0);

    if (!isAuth) {
        return null;
    }
  
    return (
      <div className="h-full pt-[15vh] w-screen max-w-md relative">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
        >
          <div className="flex flex-col mt-[2vh] items-center justify-center">
            <Card className="flex z-50 dark:bg-slate-900 dark:bg-opacity-70">
              <CardHeader className="pt-2 pb-2">
                <CardTitle className="text-sm">New Payment</CardTitle>
                <CardDescription className="text-xs">
                  Tambahkan beberapa komponen pembayaran
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="z-20 mt-[-40px] w-full h-screen rounded-[30px] dark:bg-slate-900 dark:bg-opacity-70">
              <div className="flex flex-row justify-between pr-6 pl-6 pt-[60px] gap-5">
                <div className="flex w-full">
                  {/* menyesuaikan jumlah yang harus dibayar dari komponen yang dipilih */} 
                  <Input 
                    className="text-xs" 
                    value={`Total: Rp ${totalNominal.toLocaleString()}`} 
                    readOnly
                  />
                </div>
                <div className="flex justify-end">
                  {/* set disable saat tidak ada komponen */}
                  <Button 
                    className="text-xs" 
                    disabled={totalNominal === 0}
                    onClick={() => handlePay({ selectedComponents })}
                  >
                    {onClickLoading ? (
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
                    ) : (
                      "Pay"
                    )}
                  </Button>
                </div>
              </div>
              <CardHeader className="mt-10">
                <ButtonAddPaymentComponent
                  auth={isAuth}
                  onAddComponent={handleAddComponent}
                  selectedComponents={selectedComponents}
                  onAvailablePayment={handleAvailablePayment} // Callback untuk menangani response dari API
                  availablePayment={availablePayment}
                />
              </CardHeader>

              <Card className="z-20 mt-[-60px] w-full h-screen rounded-[30px] dark:bg-slate-900 dark:bg-opacity-70">
                <CardHeader className="pt-10">
                    <div className="flex flex-col overflow-y-auto pb-4 h-[62vh] scroll-smooth">
                        {selectedComponents.map((component) => (
                            <CardItemComponent 
                                key={component.kd_komponen}
                                kode_komponen={component.kd_komponen}
                                nama_komponen={component.nama_komponen}
                                nominal_harus_dibayar={component.nominal_harus_dibayar}
                                onRemove={handleRemoveComponent} // Tambahkan fungsi ini
                            />
                        ))}

                        <div className="mt-[100px]"></div>
                    </div>
                </CardHeader>
                </Card>
            </Card>
          </div>
        </motion.div>
      </div>
    );
  };
  
  export default NewPayment;