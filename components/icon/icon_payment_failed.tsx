import Lottie from "react-lottie-player"
import payment_failed from "@/public/payment_failed.json"

const IconPaymentFailed = () => {
  return (
    <Lottie
        play
        loop
        animationData={payment_failed}
        style={{ height: "120px", width: "120px" }}
    />
  )
}

export default IconPaymentFailed