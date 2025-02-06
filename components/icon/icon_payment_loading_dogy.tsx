import Lottie from "react-lottie-player"
import payment_loading_dogy from "@/public/payment_loading_dogy.json"

const IconPaymentLoadingDogy = () => {
  return (
    <Lottie
        play
        loop
        animationData={payment_loading_dogy}
        style={{ height: "100px", width: "100px" }}
    />
  )
}

export default IconPaymentLoadingDogy