import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const HomeHero = () => {
  const { user } = useUser();
  return (
    <>
      <section className="max-w-5xl mx-auto px-6 sm:px-8 md:px-12 pt-20 pb-16 text-center">
        <div className="inline-block text-xs tracking-wide uppercase text-white border border-primary/30 bg-secondary rounded px-4 py-1 mb-8">
          Coaching Center Management
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-foreground mb-6">
          Run your coaching center{" "}
          <span className="border-b-[3px]  border-primary pb-2">
            without the chaos
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10">
          BatchWise brings student management, batch tracking, and attendance
          into one place for coaching centers with proper role separation for
          admins and teachers
        </p>

        <Link
          href={user ? "/dashboard" : "/sign-up"}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {user ? "Go to Dashboard" : "Get Started"}
        </Link>
      </section>
    </>
  );
};

export default HomeHero;
