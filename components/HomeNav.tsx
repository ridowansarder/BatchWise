import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const HomeNav = () => {
    const { user } = useUser();

  return (
    <nav className="sticky max-w-5xl mx-auto top-0 z-50 flex items-center justify-between px-6 h-14 border-b border-border bg-background">
      <span className="font-bold text-base tracking-tight">
        Batch<span className="text-primary">Wise</span>
      </span>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-muted-foreground">
              {user.firstName}
            </span>
            <Link
              href="/dashboard"
              className="text-sm px-4 py-1.5 border border-border rounded-md text-foreground hover:bg-muted transition-colors"
            >
              Dashboard
            </Link>
          </>
        ) : (
          <Link
            href="/sign-in"
            className="text-sm px-4 py-1.5 border border-border rounded-md text-foreground hover:bg-muted transition-colors"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default HomeNav;
