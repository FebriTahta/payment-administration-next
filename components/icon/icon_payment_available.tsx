import Lottie from "react-lottie-player"
import payment_available from "@/public/payment_available.json"

const IconPaymentAvailable = () => {
  return (
    <Lottie
        play
        loop
        animationData={payment_available}
        style={{ height: "120px", width: "120px" }}
    />
  )
}

export default IconPaymentAvailable