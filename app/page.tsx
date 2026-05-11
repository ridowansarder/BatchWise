"use client";
import HomeHero from "@/components/HomeHero";
import HomeNav from "@/components/HomeNav";
import HomeSections from "@/components/HomeSections";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();

  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <HomeNav />
      <HomeHero />
      <div className="max-w-3xl mx-auto px-6">
        <hr className="border-border" />
      </div>
      <HomeSections />

      <section className="max-w-5xl mx-auto px-6 pb-24 text-center">
        <div className="border border-border rounded-lg p-12">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground mb-4">
            Ready to manage your center?
          </h2>
          <p className="text-muted-foreground mb-8 text-sm">
            Sign up and set up your organization in minutes.
          </p>
          <Link
            href={user ? "/dashboard" : "/sign-up"}
            className="inline-block px-8 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {user ? "Open Dashboard" : "Create Account"}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-5 text-center text-xs text-muted-foreground">
        BatchWise — Built by{" "}
        <Link
          href="https://github.com/ridowansarder"
          className="underline hover:text-foreground transition-colors"
        >
          Ridowan
        </Link>
      </footer>
    </main>
  );
}
