"use client";

import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect to the new account page
  redirect("/account");
}