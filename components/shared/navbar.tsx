"use client";

import { UserButton, useAuth, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Layout, Menu } from "lucide-react";
import { ModeToggle } from "@/components/shared/mode-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

  const navLinks = [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/#pricing", label: "Pricing" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6",
      scrolled ? "bg-background/80 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent py-5"
    )}>
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 transition-transform hover:scale-105 active:scale-95 group shrink-0">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.3)] group-hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all">
            <Layout className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground" />
          </div>
          <span className="font-black text-2xl md:text-3xl tracking-tighter text-foreground">ScaleInfra</span>
        </Link>
        
        <div className="flex items-center gap-4 md:gap-10">
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-3 md:gap-6 md:border-l md:border-border md:pl-8">
            <div className="hidden md:block">
              <ModeToggle />
            </div>
            
            {!isSignedIn ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:block">
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="text-sm font-black uppercase tracking-[0.2em] text-foreground hover:bg-accent h-12 px-6">
                      Sign In
                    </Button>
                  </SignInButton>
                </div>
                {/* Mobile Menu */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="w-6 h-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] bg-background/95 backdrop-blur-xl">
                    <SheetHeader className="mb-8">
                      <SheetTitle className="text-left font-black tracking-tighter text-2xl uppercase">Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-6">
                      {navLinks.map((link) => (
                        <Link 
                          key={link.href} 
                          href={link.href} 
                          className="text-lg font-black uppercase tracking-widest text-foreground hover:text-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                      <div className="h-px bg-border my-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Theme</span>
                        <ModeToggle />
                      </div>
                      <SignInButton mode="modal">
                        <Button className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs">
                          Sign In
                        </Button>
                      </SignInButton>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            ) : (
              <div className="flex items-center gap-4 md:gap-8">
                <Link href="/dashboard" className="hidden md:block text-sm font-black uppercase tracking-[0.2em] text-primary hover:opacity-80 transition-opacity">Dashboard</Link>
                <div className="p-1 rounded-full bg-accent border border-border flex items-center justify-center hover:bg-accent/80 transition-colors">
                   <UserButton />
                </div>
                {/* Mobile Menu (Shared for Auth users) */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="w-6 h-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] bg-background/95 backdrop-blur-xl">
                    <SheetHeader className="mb-8">
                      <SheetTitle className="text-left font-black tracking-tighter text-2xl uppercase">Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-6">
                      <Link href="/dashboard" className="text-lg font-black uppercase tracking-widest text-primary hover:opacity-80 transition-colors">Dashboard</Link>
                      {navLinks.map((link) => (
                        <Link 
                          key={link.href} 
                          href={link.href} 
                          className="text-lg font-black uppercase tracking-widest text-foreground hover:text-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                      <div className="h-px bg-border my-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Theme</span>
                        <ModeToggle />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
