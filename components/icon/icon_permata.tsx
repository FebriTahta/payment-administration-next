import Image from "next/image"
import permata from "@/public/permata.png"

const IconPermata = () => {
  return (
    <Image
       src={permata}
       alt="permata"
       width={70}
       height={50}
       layout="intrinsic"  // Gunakan layout intrinsic
    />
  )
}

export default IconPermata