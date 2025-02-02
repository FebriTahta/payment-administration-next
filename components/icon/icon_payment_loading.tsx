import Lottie from "react-lottie-player"
import payment_loading from "@/public/payment_loading.json"

const IconPaymentLoading = () => {
  return (
    <Lottie
        play
        loop
        animationData={payment_loading}
        style={{ height: "120px", width: "120px" }}
    />
  )
}

export default IconPaymentLoading