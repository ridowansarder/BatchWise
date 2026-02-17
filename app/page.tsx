"use client";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const {user} = useUser();
  return (
    <div>
      <h1>Hello {user?.firstName}</h1>
    </div>
  );
}
