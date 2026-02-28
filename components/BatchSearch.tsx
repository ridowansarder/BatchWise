"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function BatchSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") || "");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setValue(val);
    router.push(val ? `/dashboard/batches?search=${val}` : `/dashboard/batches`);
  }

  return (
    <input
      value={value}
      onChange={handleChange}
      placeholder="Search by name or teacher..."
      className="border p-2 rounded w-full sm:w-80"
    />
  );
}