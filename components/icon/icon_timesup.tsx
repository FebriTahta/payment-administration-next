import Lottie from "react-lottie-player"
import timesup from "@/public/icon_timesup.json"

const IconTimesUp = () => {
  return (
    <Lottie
        play
        loop
        animationData={timesup}
        style={{ height: "200px", width: "200px" }}
    />
  )
}

export default IconTimesUp