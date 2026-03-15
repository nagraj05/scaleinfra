"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Terminal, Cpu, Database } from "lucide-react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";

function AuthButton({ isSignedIn }: { isSignedIn: boolean | undefined }) {
  if (isSignedIn) {
    return (
      <Button asChild size="lg" className="h-14 px-10 text-base font-black tracking-tight shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all">
        <Link href="/dashboard" className="flex items-center gap-3">
          Launch Simulator <ArrowRight className="w-5 h-5" />
        </Link>
      </Button>
    )
  }
  return (
    <SignInButton mode="modal">
      <Button size="lg" className="h-14 px-10 text-base font-black tracking-tight shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all flex items-center gap-3">
        Start Designing <ArrowRight className="w-5 h-5" />
      </Button>
    </SignInButton>
  )
}

export function Hero() {
  const { isSignedIn } = useAuth();
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-background">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"></div>
      
      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold mb-10 animate-in fade-in slide-in-from-bottom-3 duration-1000">
          <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-[10px]">NEW</span>
          <span className="text-primary tracking-wide">Interactive Visual Simulator v2.0 is live!</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 md:mb-8 leading-[0.9] text-foreground">
          Architect <span className="text-primary italic">Perfect</span> <br className="hidden md:block" /> Distributed Systems
        </h1>
        
        <p className="max-w-[800px] mx-auto text-muted-foreground text-sm md:text-2xl mb-8 md:mb-12 text-pretty leading-relaxed font-medium px-4">
          The ultimate playground for engineers. Visualize data flow, identify bottlenecks, and stress-test your architecture before writing a single line of code.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-16 md:mb-24">
          <AuthButton isSignedIn={isSignedIn} />
          <Button variant="outline" size="lg" className="h-14 px-10 text-base font-bold bg-background border-border hover:bg-accent transition-all text-foreground w-full sm:w-auto">
            <Link href="#how-it-works">Watch Demo</Link>
          </Button>
        </div>
        
        {/* Premium Visualization Mockup */}
        <div className="relative mt-10 md:mt-20 max-w-6xl mx-auto rounded-[24px] md:rounded-[32px] border border-border bg-card/40 p-2 md:p-4 shadow-[0_0_100px_rgba(var(--primary),0.1)] overflow-hidden transition-all group">
           <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
           <div className="relative rounded-[24px] border border-border bg-muted aspect-video flex items-center justify-center gap-8 md:gap-24 overflow-hidden p-8">
              {/* Grid Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10"></div>
              
              <motion.div 
                className="flex flex-col items-center gap-4 z-10 group/node"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center group-hover/node:border-primary/50 group-hover/node:bg-primary/10 transition-all duration-500 shadow-xl">
                  <Terminal className="w-10 h-10 text-primary" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover/node:text-primary transition-colors">Client</span>
              </motion.div>

              <div className="w-32 h-[2px] bg-gradient-to-r from-primary/30 to-transparent relative hidden md:block overflow-hidden">
                 <motion.div 
                   className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"
                   initial={{ x: "-100%" }}
                   animate={{ x: "100%" }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                 />
                 <motion.div 
                   className="absolute top-1/2 left-0 w-2 h-2 bg-primary rounded-full -translate-y-1/2 shadow-[0_0_15px_rgba(var(--primary),1)]"
                   initial={{ left: "0%", opacity: 0 }}
                   animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                 />
              </div>

              <motion.div 
                className="flex flex-col items-center gap-4 z-10 group/node"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
              >
                <div className="w-24 h-24 rounded-3xl bg-primary border-4 border-background flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.3)] scale-110">
                  <Cpu className="w-12 h-12 text-primary-foreground" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Load Balancer</span>
              </motion.div>

              <div className="w-32 h-[2px] bg-gradient-to-l from-green-500/30 to-transparent relative hidden md:block overflow-hidden">
                 <motion.div 
                   className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-transparent via-green-500 to-transparent opacity-50"
                   initial={{ x: "100%" }}
                   animate={{ x: "-100%" }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
                 />
                 <motion.div 
                   className="absolute top-1/2 right-0 w-2 h-2 bg-green-500 rounded-full -translate-y-1/2 shadow-[0_0_15px_rgba(34,197,94,1)]"
                   initial={{ right: "0%", opacity: 0 }}
                   animate={{ right: "100%", opacity: [0, 1, 1, 0] }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
                 />
              </div>

              <motion.div 
                className="flex flex-col items-center gap-4 z-10 group/node"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center  group-hover/node:border-green-500/50 group-hover/node:bg-green-500/10 transition-all duration-500 shadow-xl">
                  <Database className="w-10 h-10 text-green-500" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover/node:text-green-500 transition-colors">DB</span>
              </motion.div>
           </div>
        </div>
      </div>
    </section>
  );
}
