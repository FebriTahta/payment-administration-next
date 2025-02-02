import { Card, CardDescription, CardHeader } from "./ui/card";
import { formatDateTime } from "@/lib/date-time"
import { cn } from "@/lib/utils"

type PaymentDetails = {
    kodeKomponen: number;
    namaKomponen: string;
    jatuhTempo: string; // ISO 8601 format
    totalBayar: number;
    nominalBayar: number;
};

type Payment = {
    kdTrans: string;
    tanggalPembayaran: string; // ISO 8601 format
    totalBayar: number;
    totalPaid: number;
    remainingAmount: number;
    paymentStatus: string;
    details: PaymentDetails[];
};

type PaymentListProps = {
    data: Payment[]; // Array of Payment objects
    className?: string; // Add className as an optional prop
};

export function CardPaymentList({ data, className }: PaymentListProps) {

    return (
        <div className={cn(className)}>
            {
                data.map((payment, paymentIndex)=>(
                    <Card key={paymentIndex}
                        className="flex flex-col cursor-pointer justify-center mb-4 shadow-none rounded-lg w-full"
                    >
                        <CardHeader className="flex gap-4 items-center p-4 bg-gray-50 dark:bg-slate-800">
                            <div className="flex flex-col w-full">
                                {/* Baris pertama */}
                                <div className="flex justify-between">
                                    <small className="text-md">
                                        {payment.kdTrans}
                                    </small>
                                    <small className="text-md lowercase"> 
                                        {new Intl.NumberFormat("id-ID").format(payment.totalPaid)}
                                    </small>
                                </div>
                                {/* Baris kedua */}
                                <div className="flex justify-between">
                                    <small className="text-[10px]">
                                        {formatDateTime(payment.tanggalPembayaran).date}
                                    </small>
                                    <small className="text-[10px]">
                                        {payment.details.length} components
                                    </small>
                                </div>
                            </div>
                        </CardHeader>
                        <CardDescription className="pl-4 pr-4 pb-2 pt-2 text-[10px]">
                            {
                                payment.details.map((detail, detailIndex) => (
                                    <div key={detailIndex} className="flex flex-row justify-between mb-1 mt-1">
                                        <p>
                                            {detail.namaKomponen} 
                                            {
                                                detail.totalBayar - detail.nominalBayar > 0 ? (' (CICILAN) ') : (null)
                                            }
                                        </p>
                                        <p>{new Intl.NumberFormat("id-ID").format(detail.nominalBayar)}</p>
                                    </div>
                                ))
                            }
                           
                        </CardDescription>
                    </Card>
                ))
            }
        </div>
    );
}
