import Lottie from "react-lottie-player"
import payment_bill from "@/public/payment_bill.json"

const IconPaymentBill = () => {
  return (
    <Lottie
        play
        loop
        animationData={payment_bill}
        style={{ height: "100px", width: "100px" }}
    />
  )
}

export default IconPaymentBill