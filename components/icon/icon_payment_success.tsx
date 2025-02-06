import Lottie from "react-lottie-player"
import payment_success from "@/public/payment_success.json"

const IconPaymentSuccess = () => {
  return (
    <Lottie
        play
        loop
        animationData={payment_success}
        style={{ height: "100px", width: "100px" }}
    />
  )
}

export default IconPaymentSuccess