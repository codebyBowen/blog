"use client";
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LearnMoreBtn = () => {
  return (
    <div className="w-auto h-auto">
      <DotLottieReact
        src="https://lottie.host/65355825-6861-47fa-b8bc-c7f0771164e5/wgnJx2rPLC.json"
        loop
        autoplay
        options={{
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
            className: "w-full h-full",
            id: "lottie-svg-id"
          }
        }}
      />
    </div>
  );
};

export default LearnMoreBtn;
