import Lottie from "react-lottie-player"
import loading from "@/public/icon_loading5.json"

const IconLoading = () => {
  return (
    <Lottie
        play
        loop
        animationData={loading}
        style={{ height: "200px", width: "200px" }}
    />
  )
}

export default IconLoading