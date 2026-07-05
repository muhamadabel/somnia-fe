import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teman Mimpi",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
