import Lottie from "react-lottie-player"
import user_icon from "@/public/user_icon.json"

const IconUser = () => {
  return (
    <Lottie
        className="rounded-full"
        play
        loop
        animationData={user_icon}
        style={{ height: "50px", width: "50px" }}
    />
  )
}

export default IconUser