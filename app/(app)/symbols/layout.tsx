import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pustaka Simbol",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
