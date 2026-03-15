"use client";

import { UserButton, useAuth, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Layout } from "lucide-react";
import { ModeToggle } from "@/components/shared/mode-toggle";

export function Navbar() {
  const { isSignedIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6",
      scrolled ? "bg-background/80 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent py-5"
    )}>
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 transition-transform hover:scale-105 active:scale-95 group">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.3)] group-hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all">
            <Layout className="w-7 h-7 text-primary-foreground" />
          </div>
          <span className="font-black text-3xl tracking-tighter text-foreground">ScaleInfra</span>
        </Link>
        
        <div className="flex items-center gap-10">
          <div className="hidden md:flex items-center gap-10">
            <Link href="/how-it-works" className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
            <Link href="/#pricing" className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          </div>
          
          <div className="flex items-center gap-6 border-l border-border pl-8 ml-2">
            <ModeToggle />
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-sm font-black uppercase tracking-[0.2em] text-foreground hover:bg-accent h-12 px-6">
                  Sign In
                </Button>
              </SignInButton>
            ) : (
              <div className="flex items-center gap-8">
                <Link href="/dashboard" className="text-sm font-black uppercase tracking-[0.2em] text-primary hover:opacity-80 transition-opacity">Dashboard</Link>
                <div className="p-1 rounded-full bg-accent border border-border flex items-center justify-center hover:bg-accent/80 transition-colors">
                   <UserButton />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
