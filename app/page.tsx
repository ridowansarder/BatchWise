"use client";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const {user} = useUser();
  return (
    <div>
      <h1>Hello {user?.firstName}</h1>
      <Link href="/dashboard">Dashboard</Link>
    </div>
  );
}
