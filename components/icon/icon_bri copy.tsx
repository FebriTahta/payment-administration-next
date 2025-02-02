import Image from "next/image"
import mainLogo from "@/public/rp_logo.png"

const IconRP = () => {
  return (
    <Image
       src={mainLogo}
       alt="rp_logo"
       width={500}
       height={500}
    />
  )
}

export default IconRP