import Image from "next/image"
import mandiri from "@/public/Mandiri.png"

const IconMandiri = () => {
  return (
    <Image
       src={mandiri}
       alt="mandiri"
       width={70}
       height={50}
    />
  )
}

export default IconMandiri