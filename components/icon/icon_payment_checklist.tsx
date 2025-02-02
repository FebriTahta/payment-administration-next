import Lottie from "react-lottie-player"
import payment_checklist from "@/public/payment_checklist.json"

const IconPaymentOk = () => {
  return (
    <Lottie
        play
        loop
        animationData={payment_checklist}
        style={{ height: "120px", width: "120px" }}
    />
  )
}

export default IconPaymentOk