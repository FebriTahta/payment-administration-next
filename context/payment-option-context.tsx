'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from "react";

interface AuthPayload {
    NAMASISWA: string | undefined;
    exp: number;
    KDROMBEL: string;
    data: string;
    TAHUN_AJARAN: string;
}

interface AuthFormat {
    status: boolean;
    data: AuthPayload;
    cookieToken: string;
};

interface Component {
    kd_komponen: number;
    nama_komponen: string;
    nominal_harus_dibayar: number;
}

interface AvailablePaymentOptionResponse {
    auth: AuthFormat;
    selectedComponents: Component[]
}

interface PaymentOptionContextType {
    shareDataPaymentOption: AvailablePaymentOptionResponse | null;
    setSharedDataPaymentOption: React.Dispatch<React.SetStateAction<AvailablePaymentOptionResponse | null>>;
}

const PaymentOptionContext = createContext<PaymentOptionContextType | undefined>(undefined);

export const PaymentOptionProvider = ({ children }: { children: ReactNode }) => {
    const [shareDataPaymentOption, setSharedDataPaymentOption] = useState<AvailablePaymentOptionResponse | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedData = localStorage.getItem("paymentOption");
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                console.log("[PaymentOptionContext] Loaded paymentOption from localStorage:", parsedData);
                if (parsedData?.auth?.data?.TAHUN_AJARAN) {
                    console.log("[PaymentOptionContext] TAHUN_AJARAN:", parsedData.auth.data.TAHUN_AJARAN);
                } else {
                    console.warn("[PaymentOptionContext] TAHUN_AJARAN is missing in paymentOption data!");
                }
                setSharedDataPaymentOption(parsedData);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined" && shareDataPaymentOption) {
            localStorage.setItem("paymentOption", JSON.stringify(shareDataPaymentOption));
        }
    }, [shareDataPaymentOption]);

    return (
        <PaymentOptionContext.Provider value={{ shareDataPaymentOption, setSharedDataPaymentOption }}>
            {children}
        </PaymentOptionContext.Provider>
    );
};

export const usePaymentOption = (): PaymentOptionContextType => {
    const context = useContext(PaymentOptionContext);

    if (!context) {
        throw new Error("usepaymentOption must be used within a paymentOptionProvider");
    }

    return context;
};
