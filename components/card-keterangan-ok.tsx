import { Card } from "@/components/ui/card"
import IconPaymentOk from "./icon/icon_payment_checklist"
import { currentDateTime } from "@/lib/date-time"

export default function CardKeteranganOk() {

    return (
        <Card className="w-full max-w-md p-4 space-y-4 ">
            <div className="flex items-center justify-between space-y-0 ">
                <div className="icon">
                    <IconPaymentOk />
                </div>
                <div className="flex flex-col text text-right text-sm">
                    <small>Tidak ada cicilan maupun tunggakan</small>
                    <small>Terimakasih</small>
                </div>
            </div>
            <div className="h-px bg-border" />

            {/* Components list skeleton */}
            <div>
                <div className="flex justify-between items-center text-xs">
                    <p>{ currentDateTime().date }</p>
                    <p>Salam Hormat</p>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <p>{ currentDateTime().time }</p>
                    <p>Pengurus</p>
                </div>
            </div>
        </Card>
    )
}

