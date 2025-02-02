import Image from "next/image"
import bri from "@/public/bri.png"

const IconBri = () => {
  return (
    <Image
       src={bri}
       alt="bri"
       width={70}
       height={50}
    />
  )
}

export default IconBri