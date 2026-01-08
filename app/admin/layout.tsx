import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terraplie Admin Dashboard",
  description: "View and analyze user submissions",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
