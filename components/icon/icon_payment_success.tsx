import Lottie from "react-lottie-player"
import payment_success from "@/public/payment_success.json"

const IconPaymentSuccess = () => {
  return (
    <Lottie
        play
        loop
        animationData={payment_success}
        style={{ height: "120px", width: "120px" }}
    />
  )
}

export default IconPaymentSuccess