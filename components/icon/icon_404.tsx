import Lottie from "react-lottie-player"
import icon_404 from "@/public/icon_404.json"

const Icon404 = () => {
  return (
    <Lottie
        play
        loop
        animationData={icon_404}
        style={{ height: "200px", width: "200px" }}
    />
  )
}

export default Icon404