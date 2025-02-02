import { XCircle } from "lucide-react";
import { Card } from "./ui/card"
import { NotebookPenIcon } from "lucide-react"

type CardItemComponentProps = {
    kode_komponen: number;
    nama_komponen: string;
    nominal_harus_dibayar: number;
    onRemove: (kodeKomponen: number, namaKomponen: string) => void; // Tambahkan prop untuk menghapus
}

const CardItemComponent = ({kode_komponen, nama_komponen, nominal_harus_dibayar,onRemove}:CardItemComponentProps) => {
  return (
    <Card
        className="flex flex-col cursor-pointer justify-center mb-4 p-4 gap-y-2 bg-gray-50 shadow-none dark:bg-slate-800 rounded-lg"
    >
        <div className="flex gap-4 items-center">
            {/* Ikon di sebelah kiri */}
            <div className="icon">
                <NotebookPenIcon/>
            </div>
            {/* Teks di sebelah kanan */}
            <div className="flex flex-col w-full">
                {/* Baris pertama */}
                <div className="flex justify-between">
                    <small className="text-md">
                        {nama_komponen}
                    </small>
                    <small
                        className="text-md lowercase cursor-pointer"
                        onClick={() => onRemove(kode_komponen, nama_komponen)} // Panggil fungsi saat XCircle diklik
                    >
                        <XCircle size={17} />
                    </small>
                </div>
                {/* Baris kedua */}
                <div className="flex justify-between">
                    <small className="text-[10px]">
                        {new Intl.NumberFormat("id-ID").format(nominal_harus_dibayar)}
                    </small>
                </div>
            </div>
        </div>
    </Card>
  )
}

export default CardItemComponent