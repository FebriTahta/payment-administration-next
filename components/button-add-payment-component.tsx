import * as React from "react";
import { PlusIcon, Notebook } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import { availablePaymentComponents } from "@/api/payment-component-list";

// Menyesuaikan tipe data yang diterima
interface Component {
  kd_komponen: number;
  nama_komponen: string;
  nominal_harus_dibayar: number;
}

// Data yang diterima dari API
interface ComponentList {
  kode_komponen: number;
  nama_komponen: string;
  sisa: number; // Mungkin ini adalah `nominal_harus_dibayar`
}

interface AvailablePaymentComponentsResponse {
  data: {
    component_list: ComponentList[];
  };
}

interface AuthPayload {
  NAMASISWA: string | undefined;
  exp: number;
  KDROMBEL: string;
  data: string;
  TAHUN_AJARAN: string; // tambahkan ini
}

type AuthFormat = {
  status: boolean;
  data: AuthPayload;
  cookieToken: string;
};

export function ButtonAddPaymentComponent({
  auth,
  onAddComponent,
  selectedComponents,
  onAvailablePayment,
  availablePayment,
}: {
  auth: AuthFormat;
  onAddComponent: (component: Component, nama_komponen: string) => void;
  selectedComponents: Component[];
  onAvailablePayment: (paymentData: Component[]) => void;
  availablePayment: Component[];
}) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleOnClick = async () => {
    setOpen((open) => !open);
    if (!mounted) {
      try {
        // Mengambil response dari API
        const response: AvailablePaymentComponentsResponse = await availablePaymentComponents(
          auth.data.data,
          auth.data.KDROMBEL,
          null,
          auth.cookieToken,
          auth.data.TAHUN_AJARAN
        );

        // Mapping response data agar sesuai dengan tipe Component
        const mappedComponents: Component[] = response.data.component_list.map((item) => ({
          kd_komponen: item.kode_komponen,
          nama_komponen: item.nama_komponen,
          nominal_harus_dibayar: item.sisa, // Menggunakan `sisa` sebagai `nominal_harus_dibayar`
        }));

        // Mengirimkan data yang sudah dipetakan ke komponen induk
        onAvailablePayment(mappedComponents);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        setError(`Failed to fetch: ${errorMessage}`);
      }
      setMounted(true);
    }
  };

  const handleItemClick = (item: Component, nama_komponen: string) => {
    onAddComponent(item, nama_komponen); // Menambahkan komponen yang dipilih ke dalam daftar komponen yang dipilih
  };

  return (
    <>
      <Button className="text-[10px] mt-[-50px] max-w-[80px]" onClick={handleOnClick}>
        <PlusIcon />
        ADD
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search payment components..." />
        <CommandList>
          <CommandEmpty>{error ? error : "No results found."}</CommandEmpty>
          <CommandGroup heading="Payment Components">
            {availablePayment
              .filter(
                (item) =>
                  !selectedComponents.some(
                    (selected) => selected.kd_komponen === item.kd_komponen
                  )
              )
              .map((item) => (
                <CommandItem
                  key={item.kd_komponen}
                  onSelect={() =>
                    handleItemClick(item, item.nama_komponen)
                  }
                >
                  <Notebook />
                  <span>{item.nama_komponen}</span>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
