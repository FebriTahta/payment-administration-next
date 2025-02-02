import { cn } from "@/lib/utils";
import { Card } from "./ui/card";
import IconUser from "./icon/icon_user";

export default function CardItemUser({ namaSiswa, nis, kdRombel }: { namaSiswa: string; nis: string, kdRombel: string }) {
  return (
    <Card
      className={cn(
        "flex flex-col cursor-pointer justify-center mx-4 mb-4 p-2 gap-y-2 bg-gray-50 shadow-none dark:bg-transparent rounded-lg dark:bg-slate-700"
      )}
    >
      <div className="flex gap-4 items-center">
        {/* Ikon di sebelah kiri */}
        <div className="icon rounded-full">
          <IconUser />
        </div>
        <div className="flex flex-col w-full">
          <small className="text-xs">{namaSiswa}</small>
          <small className="text-[10px] font-thin">{kdRombel} : {nis || '-'}</small>
        </div>
      </div>
    </Card>
  );
}
