"use client";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

const Header = dynamic(() => import("./ui/header"), { ssr: false });

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
} 