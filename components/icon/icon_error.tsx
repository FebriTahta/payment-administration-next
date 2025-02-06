import Lottie from "react-lottie-player"
import icon_error from "@/public/icon_error.json"

const IconError = () => {
  return (
    <Lottie
        play
        loop
        animationData={icon_error}
        style={{ height: "100px", width: "100px" }}
    />
  )
}

export default IconError