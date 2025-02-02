import Image from "next/image"
import bni from "@/public/bni.png";
import bri from "@/public/bri.png";
import mandiri from "@/public/Mandiri.png";
import permata from "@/public/permata.png";
import gopay from "@/public/logo-gopay.png";

export const BankMethod = [
    {
        name:   'BRI',
        icon:   <Image src={bri} alt="bri" width={70} height={50}/>
    },
    {
        name:   'BNI',
        icon:   <Image src={bni} alt="bni" width={70} height={50}/>
    },
    {
        name:   'Mandiri',
        icon:   <Image src={mandiri} alt="mandiri" width={70} height={50}/>
    },
    
    {
        name:   'Permata',
        icon:   <Image src={permata} alt="permata" width={70} height={50}/>
    }
];

export const WalletMethod = [
    {
        name:   'Gopay',
        icon:   <Image src={gopay} alt="gopay" width={70} height={50}/>
    },
];