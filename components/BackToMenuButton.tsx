"use client"
import React from 'react';
import Link from 'next/link';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import '@dotlottie/react-player/dist/index.css';

const BackToMenuButton: React.FC = () => {
  return (
    <Link href="/" className="text-blue-500 hover:underline">
      <DotLottieReact
        src="https://lottie.host/ac791abd-150c-4bb8-9f9e-c7af3110cf66/nkOpW9aQO8.json"
        loop
        autoplay
      />
    </Link>
  );
};

export default BackToMenuButton;