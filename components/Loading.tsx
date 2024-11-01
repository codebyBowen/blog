"use client";
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Loading = () => {
  return (
    <div className="w-20 h-20">
      <DotLottieReact
        src="https://lottie.host/4a2b10c2-ba0c-49e7-a390-4d831d4336f1/IAg8nSjcaU.json"
        loop
        autoplay
      />
    </div>
  );
};

export default Loading;

