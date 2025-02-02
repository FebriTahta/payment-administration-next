import { cn } from "@/lib/utils"
import { Card } from "./ui/card"
import { NotebookPen, BookMarked, LibraryBig, BookType, CalendarCheck2, School, FolderSearch, Grid2X2, List } from "lucide-react";
// import { 
//     ComponentList
// } from "@/interface/payment-list-page";
import { formatDateTime } from "@/lib/date-time"

type Icons = {
    icon?: string | null;
};

type DetailPayment = {
    kode_komponen: number,
    nama_komponen: string,
    jatuh_tempo: string,
    nominal_bayar?: number,
    total_bayar?: number,
    terbayar: number,
    sisa: number,
    status: string,
    kd_trans?: string,
    tanggal_bayar?: string,
    metode_bayar?: string
}

const CardItemBeta = ({click, item, icon} : {click: ()=>void, item: DetailPayment, icon: Icons}) => {


const iconMap: Record<string, React.ElementType> = {
    List: List,
    NotebookPen: NotebookPen,
    BookMarked: BookMarked,
    LibraryBig: LibraryBig,
    BookType: BookType,
    CalendarCheck2: CalendarCheck2,
    School: School,
    FolderSearch: FolderSearch,
    Grid2X2: Grid2X2,
};

// console.log(icon);
// console.log(icon.icon); //


// Ambil komponen ikon dari peta
const IconComponent = icon.icon && iconMap[icon.icon.trim()] ? iconMap[icon.icon.trim()] : List

  return (
    <Card
        onClick={click}
        className={cn(
            "flex flex-col cursor-pointer justify-center mx-4 mb-4 p-4 gap-y-2 bg-gray-50 shadow-none dark:bg-slate-800 rounded-lg"
        )}
    >
        <div className="flex gap-4 items-center">
            {/* Ikon di sebelah kiri */}
            <div className="icon">
                <IconComponent className="h-5 w-5" />
            </div>
            {/* Teks di sebelah kanan */}
            <div className="flex flex-col w-full">
                {/* Baris pertama */}
                <div className="flex justify-between">
                <small className="text-md">
                    {item.nama_komponen}
                </small>
                <small className="text-md lowercase"> 
                    {
                        item.status.length > 11 && item.status !== 'BELUM DIBAYAR' 
                        ? item.status.slice(-11) 
                        : item.status === 'BELUM LUNAS'
                        ? "cicilan"
                        : item.status
                    }
                </small>
                </div>
                {/* Baris kedua */}
                <div className="flex justify-between">
                <small className="text-[10px]">
                    {
                        item.terbayar !== 0 && item.sisa !== 0
                        ? new Intl.NumberFormat("id-ID").format(item.terbayar) +'/'+new Intl.NumberFormat("id-ID").format(item.sisa)
                        : item.terbayar !== 0 && item.sisa === 0
                        ? new Intl.NumberFormat("id-ID").format(item.terbayar)
                        : new Intl.NumberFormat("id-ID").format(item.sisa)
                    }
                </small>
                <small className="text-[10px]">
                    {item.jatuh_tempo
                    ? formatDateTime(item.jatuh_tempo).date
                    : item.jatuh_tempo
                    ? formatDateTime(item.jatuh_tempo).date
                    : "-"}
                </small>
                </div>
            </div>
        </div>
    </Card>
  )
}

export default CardItemBeta