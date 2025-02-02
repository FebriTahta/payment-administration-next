'use client'

import { useState } from "react";
import { Button } from "./ui/button";
import { ScreenShareIcon, ScreenShareOff } from "lucide-react";

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <Button 
        type="button"
        onClick={toggleFullscreen} 
        className="flex rounded-lg shadow-md">
        {
            isFullscreen
            ? <ScreenShareOff/>
            : <ScreenShareIcon/>
        }
    </Button>
  );
}
