import Lottie from "react-lottie-player"
import timesup from "@/public/icon_timesup.json"

const IconTimesUp = () => {
  return (
    <Lottie
        play
        loop
        animationData={timesup}
        style={{ height: "100px", width: "100px" }}
    />
  )
}

export default IconTimesUp