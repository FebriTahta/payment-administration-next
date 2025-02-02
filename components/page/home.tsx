'use client'

import { useState, useEffect  } from 'react';
import Link from "next/link";
import { Card,CardHeader,CardTitle,CardDescription, CardContent } from "../ui/card"
import { NotebookPen, BookMarked, LibraryBig, BookType, CalendarCheck2, School, FolderSearch, Grid2X2, ChartNoAxesGantt } from "lucide-react";
import { motion } from "framer-motion";
import { MonthlyRecapPaymentResponse } from "@/interface/home-page";
import { monthlyRecapPayment } from '@/api/home'; 
import SkeletonItemCard from '../skeleton-item-card';
import CardItemBeta from '../card-item-beta';
import { checkTokenActive } from '@/lib/jwt';
import { usePaymentDetail } from "@/context/payment-detail-context";
import { useRouter } from "next/navigation";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from "@/hooks/use-toast";
import { searchTransaction } from '@/api/search-transaction';
import { useSearchData } from '@/context/search-context';


const main_menu1 = [
  { menu_icon: BookMarked, menu_text: 'SPP', komponen: 'spp',menu_icon_text: 'BookMarked'},
  { menu_icon: BookType, menu_text: 'USP', komponen: 'usp',menu_icon_text: 'BookType' },
  { menu_icon: NotebookPen, menu_text: 'UAS', komponen: 'uas',menu_icon_text: 'NotebookPen' },
  { menu_icon: LibraryBig, menu_text: 'LKS', komponen: 'lks',menu_icon_text: 'LibraryBig' },
];

const main_menu2 = [
  { menu_icon: CalendarCheck2, menu_text: 'KEG' , komponen: 'kegiatan',menu_icon_text: 'CalendarCheck2'},
  { menu_icon: School, menu_text: 'D.U', komponen: 'daftar ulang',menu_icon_text: 'School' },
  { menu_icon: Grid2X2, menu_text: 'ETC', komponen: 'etc',menu_icon_text: 'Grid2X2' },
  { menu_icon: FolderSearch, menu_text: 'SEARCH', komponen: 'search',menu_icon_text: 'FolderSearch' },
];

const Home = () => {

  const [namaSiswa, setNamaSiswa] = useState('');
  const [kdRombel, setKdRombel] = useState('');
  const [nis, setNis] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState<MonthlyRecapPaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState('');
  const {setSharedData} = usePaymentDetail();
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showNoteBox, setShowNoteBox] = useState(false); 
  const [orderIdOrKdTrans, setOrderIdOrKdTrans] = useState<string>('');
  const [loadingClick, setLoadingClick] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { setSearchSharedData } = useSearchData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusToken = checkTokenActive();
        if (statusToken.status == true) {
          setNamaSiswa(statusToken.data?.NAMASISWA || "-");
          setKdRombel(statusToken.data?.KDROMBEL || "-");
          setNis(statusToken.data?.data || "-");
          setToken(statusToken.cookieToken || "-");
          try {
            const monthlyPaymentRes = await monthlyRecapPayment(statusToken.data?.data, statusToken.cookieToken);
            setMonthlyPayment(monthlyPaymentRes);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setError(`${errorMessage}`);
          }
        } else {
          setError('No auth token found.');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(`An error occurred during data fetching.: ${errorMessage}`);
      } finally {
        setLoading(false); // Pastikan loading selesai
      }
    };

    fetchData();
  }, []);

  type DetailOption = {
    kd_trans: string;
    tanggal_bayar?: string; // Mengizinkan undefined
    metode_bayar?: string;  // Mengizinkan undefined
  };
  
  type DetailPayment = {
    kode_komponen: number,
    nama_komponen: string,
    jatuh_tempo: string,
    nominal_bayar: number,
    terbayar: number,
    sisa: number,
    status: string,
    kd_trans?: string,
    tanggal_bayar?: string,
    metode_bayar?: string,
    detail_option?: DetailOption[]; // Mengizinkan undefined
  }

  const MapToDetailContext = (item: DetailPayment) => {
    return {
      kode_komponen: item.kode_komponen,
      nama_komponen: item.nama_komponen,
      jatuh_tempo: item.jatuh_tempo,
      total_bayar: item.nominal_bayar,
      terbayar: item.terbayar,
      sisa: item.sisa,
      status: item.status,
      detail_option: item.kd_trans
        ? [
            {
              kd_trans: item.kd_trans ?? '',
              tanggal_bayar: item.tanggal_bayar ?? '',
              metode_bayar: item.metode_bayar ?? '',
            },
          ]
        : [], // Nilai default
    };
  };
  

  const handleOnClick=(item: DetailPayment)=> {
    const detailData = MapToDetailContext(item);
    setSharedData(detailData);
    router.push('/payment-detail');
  }

  const getCurrentMonthYear = () => {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' });
    return formatter.format(date);
  };

  const currentMonthYear = getCurrentMonthYear();

  const handleShowSearch = (param: boolean) => {
    setShowSearchBox(param);
  }

  const handleSearchForm = async (e: React.FormEvent) => {
    setLoadingClick(true);
    // Mencegah form submit default (refresh halaman)
    e.preventDefault(); 
    // Mencegah event bubbling
    e.stopPropagation(); 
    // Cek apakah input kosong
    if (!orderIdOrKdTrans.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Data tidak boleh kosong",
      });
      // Hentikan eksekusi jika data kosong
      return; 
    }
    // kalau ingin melakukan logging menggunakan stringify
    // const payload = JSON.stringify({ orderIdOrKdTrans: orderIdOrKdTrans });
    if (token) {
      // pada api post sudah include stringify
      const fetchSearchData = await searchTransaction({ orderIdOrKdTrans: orderIdOrKdTrans }, token);
      if (fetchSearchData.status == 404 || fetchSearchData.status == 500) {
        toast({
          variant: "destructive",
          title: "Status data "+fetchSearchData.status,
          description: fetchSearchData.message,
        });
      }else{
        setSearchSharedData(fetchSearchData.data);
        router.push('/search-transaction');
      }

      setLoadingClick(false);
    }

  }

  return (
    <div className="h-full top-5 w-screen max-w-md relative">
      {/* Konten Tengah */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        className="h-52 w-full flex flex-col items-center justify-center z-10"
      >
        <h5 className="text-center font-bold bg-clip-text bg-gradient-to-br
          dark:text-transparent 
          dark:from-white 
          dark:via-neutral-200 
          dark:to-black/[0.6]
           ">
          Monthly Payment
        </h5>
        <p className="text-sm text-center font-bold bg-clip-text bg-gradient-to-br 
          dark:text-transparent  
          dark:from-white 
          dark:via-neutral-200 
          dark:to-black/[0.6] 
          ">
          {
            currentMonthYear
          }
        </p>
        <div className="flex text-4xl mt-4 bg-clip-text bg-gradient-to-br 
          dark:text-white 
          dark:from-white 
          dark:via-neutral-200 
          dark:to-black/[0.6] 
          ">
          <span className="flex mr-2 text-sm">Rp</span>
          {loading || error ? (<>
          <div role="status">
              <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
          </div>
          </>) : (new Intl.NumberFormat('id-ID').format(monthlyPayment?.data.total_payment || 0))},-
        </div>
      </motion.div>

      {/* card*/}
      <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
         
        >
      <div className="flex flex-col mt-[-35px] items-center justify-center">
        {/* card name */}
        <Card className="flex z-50 dark:bg-slate-800 dark:bg-opacity-70 ">
          <CardHeader className="pt-2 pb-2">
            <CardTitle className="text-sm">{namaSiswa}</CardTitle>
            <CardDescription>{kdRombel}</CardDescription>
          </CardHeader>
        </Card>
        {/* card payment component */}
        <Card className="z-20 pr-7 pl-7 mt-[-40px] w-full h-screen rounded-[30px] dark:bg-slate-900 dark:bg-opacity-70">
          <CardHeader>
            <CardTitle className="mt-10">Komponen Pembayaran</CardTitle>
          </CardHeader>

          <CardContent className='pb-5'>
            {/* menu component 1 */}
            <div className="menu flex justify-between">
              {main_menu1.map((item, index)=> (
                <div 
                  key={index}
                  className="flex flex-col hover:scale-125 h-14 w-14 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <div className="flex icon">
                    <Link href={{
                        pathname: '/payment-component-list',
                        query: {
                          nis: btoa(nis),
                          kd_rombel: btoa(kdRombel),
                          payment_type: btoa(encodeURIComponent(item.komponen.toLowerCase())), // komponen
                          i_pay: item.menu_icon_text, // icon
                          token: btoa(token)
                        },
                      }}>
                      {
                        <item.menu_icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                      }
                    </Link>
                  </div>
                  <div className="flex text">
                    <p className="text-[10px]">{item.menu_text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="menu flex justify-between mt-4">
              {main_menu2.map((item, index)=> (
                <div key={index} className="flex flex-col hover:scale-125 h-14 w-14 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <div className="flex icon">
                    {item.komponen !== 'search' ? 
                      <Link href={{
                          pathname: '/payment-component-list',
                          query: {
                            nis: btoa(nis),
                            kd_rombel: btoa(kdRombel),
                            payment_type: btoa(encodeURIComponent(item.komponen.toLowerCase())), // komponen
                            i_pay: item.menu_icon_text, // icon
                            token: btoa(token)
                          },
                        }}>
                        {
                          <item.menu_icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                        }
                      </Link>
                    : 
                    // logika tombol cari disini
                      <Link
                        href={'#'}
                          onClick={
                            () => {
                              handleShowSearch(true)
                            }
                          }
                      >
                      {
                        <item.menu_icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                      }
                      </Link>
                    }
                    
                  </div>
                  <div className="flex text">
                    <p className="text-[10px]">{item.menu_text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          <CardHeader className='mt-0 pt-0 pb-4'>
            <div className="flex flex-col items-end">
              <p className="flex text-xs">Pembayaran bulan ini</p>
              <p className='flex text-xs cursor-pointer gap-1'
                onClick={()=>setShowNoteBox(true)}
              >
                 catatan<ChartNoAxesGantt className='size-4'/>
              </p>
             </div>
          </CardHeader>

          
          {/* transaksi bulan ini */}
          <div className="overflow-y-auto pb-4 h-[30vh] scroll-smooth">
            {
              loading || error || monthlyPayment?.data.payment_list.length == 0 ? (
                <div className='pr-7 pl-7'>
                  <SkeletonItemCard/>
                </div>
              ) 
              : (
                monthlyPayment?.data.payment_list.map((item, index) => (
                  <CardItemBeta 
                    key={index} 
                    item={item} 
                    icon={{ icon: null }}
                    click={()=>handleOnClick(item)}/>
                ))
              )
            }
            <div className="flex justify-center shadow-none dark:bg-slate-900 dark:bg-opacity-70 rounded-lg">
              {
                error || monthlyPayment?.data.payment_list.length == 0 && 
                (
                  error 
                  ? error 
                  : <div className='text-center leading-1'>
                    <p className="text-red-500 text-[10px] mt-4">Belum ada pembayaran yang dilakukan </p>
                    <p className="text-red-500 text-[10px] mt-1">(Bulan Ini)</p>
                  </div>
                )
                
              }
              <div className="mt-[50px]"></div>
            </div>
          </div>
        </Card>
      </div>
      </motion.div>

      {showSearchBox && (
        <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={() => handleShowSearch(false)}
      >
        <form 
          onSubmit={handleSearchForm} 
          onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat klik form
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col bg-white rounded-lg p-6 shadow-lg max-w-xs w-full text-center items-center"
          >
            <h3 className="text-sm font-bold mb-2 max-w-[250px] text-gray-800">
              ORDER ID / KODE TRANSACTION (ONLINE PAYMENT)
            </h3>
            <Input
              className='text-gray-800'
              id="orderIdOrKdTrans"
              placeholder="....."
              value={orderIdOrKdTrans}
              onChange={(e) => setOrderIdOrKdTrans(e.target.value)}
              type="text"
            />
            <div className="flex flex-row justify-between gap-2 mt-5 w-full">
              <Button
                type="button"
                className="flex bg-slate-600 dark:text-white w-full"
                onClick={() => handleShowSearch(false)}
              >
                Close
              </Button>
              <Button
                type="submit"
                className="flex bg-purple-500 dark:text-white w-full"
              >
                {loadingClick ? (
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
                  "Search"
                )}
              </Button>
            </div>
          </motion.div>
        </form>
      </div>
      )}


      {showNoteBox && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col bg-white dark:bg-slate-900 rounded-lg p-6 shadow-lg max-w-xs w-full text-center items-center"
          >
            <h3 className="text-sm font-bold mb-2 max-w-[250px] gap-2 flex">
              CATATAN <ChartNoAxesGantt className='size-4'/>
            </h3>
            <div className='flex flex-col text-left'>
              <small className='flex'>
                Untuk menjaga performa
              </small>
              <small className='flex'>
                Administrasi pembayaran digital menerapkan caching
              </small>
              <small className='flex'>
                Diperlukan sekitar 30 detik agar pembayaran ter-update otomatis
              </small>
              <small className='flex'>
                Daftar komponen yang sudah dilakukan pembayaran dan berhasil tidak akan muncul kembali
              </small>
              <small className='flex'>
                untuk mencegah pembayaran ganda pada komponen pembayaran yang sama
              </small>
            </div>
            <div className="flex flex-row justify-between gap-2 mt-5 w-full">
              <Button
                type="button"
                className="flex bg-slate-600 dark:text-white w-full"
                onClick={() => setShowNoteBox(false)}
              >
                Close
              </Button>
            </div>
          </motion.div>
      </div>
      )}
    </div>
  );
};

export default Home;
