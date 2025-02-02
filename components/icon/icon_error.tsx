import Lottie from "react-lottie-player"
import icon_error from "@/public/icon_error.json"

const IconError = () => {
  return (
    <Lottie
        play
        loop
        animationData={icon_error}
        style={{ height: "200px", width: "200px" }}
    />
  )
}

export default IconError