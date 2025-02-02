import { cn } from "@/lib/utils";
import { Card, CardDescription, CardHeader } from "./ui/card";
import { formatDateTime } from "@/lib/date-time";

type InsufficientComponent  = {
    kodeKomponen: number;
    namaKomponen: string;
    jatuhTempo: string; // ISO date string
    totalBayar: number;
    totalPaid: number;
    instalment: Instalment[];
    remainingAmount: number;
}

type Instalment = {
    kdTrans: string;
    nominalinstalment: number;
    paymentTime: string;
}

type InsufficientProps = {
    data: InsufficientComponent[]; // Array of Payment objects
    className?: string; // Add className as an optional prop
};


const CardInsufficientComponent = ({data,className}:InsufficientProps) => {
  return (
    <div className={cn(className)}>
        {
            data.map((item,index)=>(
                <Card key={index}
                        className="flex flex-col cursor-pointer justify-center mb-4 shadow-none rounded-lg w-full"
                    >
                    <CardHeader className="flex gap-4 items-center p-4 bg-gray-50 dark:bg-slate-800">
                        <div className="flex flex-col w-full">
                            {/* Baris pertama */}
                            <div className="flex justify-between">
                                <small className="text-md">
                                    {item.namaKomponen}
                                </small>
                                <small className="text-md lowercase"> 
                                    {new Intl.NumberFormat("id-ID").format(item.totalBayar)}
                                </small>
                            </div>
                            {/* Baris kedua */}
                            <div className="flex justify-between">
                                <small className="text-[10px]">
                                    {item.instalment.length} cicilan
                                </small>
                                <small className="text-[10px]">
                                    Kekurangan : {new Intl.NumberFormat("id-ID").format(item.remainingAmount)}
                                </small>
                            </div>
                        </div>
                    </CardHeader>

                    <CardDescription className="pl-4 pr-4 pb-2 pt-2 text-[10px]">
                        {
                            item.instalment.map((cicilan, detailIndex) => (
                                <div key={detailIndex} className="mb-1">
                                    <div className="flex flex-row justify-between">
                                        <p>
                                            {cicilan.kdTrans} 
                                        </p>
                                        <p>{new Intl.NumberFormat("id-ID").format(cicilan.nominalinstalment)}</p>
                                        
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <p>
                                            {formatDateTime(cicilan.paymentTime).date}
                                        </p>
                                    </div>
                                </div>
                                
                            ))
                        }
                        
                    </CardDescription>
                </Card>
            ))
        }
    </div>
  )
}

export default CardInsufficientComponent