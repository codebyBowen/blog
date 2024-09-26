"use client";

import { ThemeProvider } from "next-themes";
import ThemeToggle from "../components/ThemeToggle";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class">
      {children}
      <ThemeToggle />
    </ThemeProvider>
  );
};

export default Providers;
