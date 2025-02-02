import Image from "next/image"
import bni from "@/public/bni.png"

const IconBni = () => {
  return (
    <Image
       src={bni}
       alt="bni"
       width={70}
       height={50}
    />
  )
}

export default IconBni