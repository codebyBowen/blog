"use client";
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";


const CreateBtn = () => {
  return (
    <Link href="/create" className="fixed bottom-5 right-5 text-gray-800 dark:text-gray-200 p-2 rounded-full shadow-lg max-w-20 max-h-20">
      <DotLottieReact
        src="https://lottie.host/c2f0ad73-517b-4c8f-9156-6684dded6bc4/81i7xvDqqr.json"
        loop
        autoplay
        // options={{
        //   rendererSettings: {
        //     preserveAspectRatio: "xMidYMid slice",
        //     className: "w-full h-full",
        //     id: "lottie-svg-id"
        //   }
        // }}
      />
    </Link>
  );
};

export default CreateBtn;
