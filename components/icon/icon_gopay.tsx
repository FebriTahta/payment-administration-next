import Image from "next/image"
import gopay from "@/public/logo-gopay.png"

const IconGopay = () => {
  return (
    <Image
       src={gopay}
       alt="gopay"
       width={70}
       height={50}
       layout="intrinsic"  // Gunakan layout intrinsic
    />
  )
}

export default IconGopay