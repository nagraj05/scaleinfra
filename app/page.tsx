"use client";

import { Navbar } from "@/components/shared/navbar";
import { Hero } from "@/components/features/landing/hero";
import { Button } from "@/components/ui/button";
import { Check, Zap, Shield, Rocket } from "lucide-react";
import Link from "next/link";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

function AuthButton({ isSignedIn }: { isSignedIn: boolean | undefined }) {
  if (isSignedIn) {
    return (
      <Button asChild size="lg" className="h-14 px-10 text-base font-black tracking-tight shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all">
        <Link href="/dashboard" className="flex items-center gap-3 text-primary-foreground">
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

export default function Home() {
  const { isSignedIn } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <Navbar />
      <main className="grow">
        <Hero />
        
        {/* Features Section */}
        <section id="how-it-works" className="py-32 bg-muted/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent opacity-20"></div>
          <div className="container mx-auto px-4">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-foreground text-balance">The Engineer&apos;s Sandbox</h2>
              <p className="text-muted-foreground text-xl max-w-3xl mx-auto font-medium leading-relaxed">
                Everything you need to design, simulate, and optimize complex system architectures in one place.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  title: "Ultra-Fast Design", 
                  desc: "Blazing fast drag-and-drop interface with snap-to-grid and smart connections.", 
                  icon: Rocket,
                  color: "text-blue-500",
                  bg: "bg-blue-500/10"
                },
                { 
                  title: "Deep Simulation", 
                  desc: "Watch real-time data packets flow between nodes and identify bottlenecks instantly.", 
                  icon: Zap,
                  color: "text-primary",
                  bg: "bg-primary/10"
                },
                { 
                  title: "Fail-Safe Analysis", 
                  desc: "Inject errors, increase latency, and verify your system's resilience under pressure.", 
                  icon: Shield,
                  color: "text-green-500",
                  bg: "bg-green-500/10"
                }
              ].map((feature, i) => (
                <div key={i} className="group relative p-8 rounded-[32px] bg-card border border-border hover:border-primary/50 transition-all duration-500 shadow-sm">
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-foreground tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section (Redesigned) */}
        <section id="pricing" className="py-32 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-foreground">Scale Your Curiosity</h2>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
                Choose the workspace that fits your engineering journey.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
              {/* Starter Plan */}
              <div className="relative group p-10 rounded-[40px] bg-card border border-border hover:border-primary/20 transition-all shadow-sm">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-black text-foreground tracking-tight">Starter</h3>
                    <p className="text-muted-foreground font-medium mt-1">Perfect for individuals and learning.</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-foreground">$0</span>
                    <span className="text-muted-foreground font-bold tracking-widest text-xs uppercase text-opacity-70 text-foreground">Perpetual Free</span>
                  </div>
                  <ul className="space-y-4 py-8 border-y border-border">
                    {[
                      "3 Active Simulations",
                      "Standard Component Library",
                      "Real-time Flow Analysis",
                      "Community Access"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-foreground/70 font-bold text-sm">
                        <Check className="w-5 h-5 text-primary" /> {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full h-14 rounded-2xl text-base font-black tracking-tight" variant="outline">Current Plan</Button>
                </div>
              </div>

              {/* Architect Plan */}
              <div className="relative p-[2px] rounded-[40px] bg-gradient-to-tr from-primary to-blue-500 overflow-hidden shadow-[0_0_50px_rgba(var(--primary),0.2)]">
                <div className="relative p-10 rounded-[38px] bg-card h-full space-y-6">
                  <div className="absolute top-8 right-8 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary tracking-widest uppercase">Most Popular</div>
                  <div>
                    <h3 className="text-3xl font-black text-foreground tracking-tight italic">Architect</h3>
                    <p className="text-muted-foreground font-medium mt-1">For serious system design.</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-foreground">$5</span>
                    <span className="text-muted-foreground font-bold tracking-widest text-xs uppercase">/ Billed monthly</span>
                  </div>
                  <ul className="space-y-4 py-8 border-y border-border">
                    {[
                      "Unlimited Simulations",
                      "Advanced Performance Profiling",
                      "Multi-Region Latency Simulation",
                      "Export to Mermaid & Terraform",
                      "Priority Feature Access"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-foreground font-bold text-sm">
                        <Check className="w-5 h-5 text-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" /> {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full h-14 rounded-2xl text-base font-black tracking-tight group overflow-hidden" disabled>
                    <span className="relative z-10">Coming Soon</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary relative overflow-hidden flex flex-col items-center">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,0,0,0.1),transparent)]"></div>
           <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-primary-foreground mb-10 text-center">Ready to simulate <br/> the future?</h2>
           <AuthButton isSignedIn={isSignedIn} />
        </section>
      </main>

      <footer className="py-16 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 text-foreground font-black text-2xl tracking-tighter">
             <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-mono text-xl text-primary-foreground">S</div>
             ScaleInfra
          </div>
          <p className="text-sm text-muted-foreground font-bold tracking-wide">
            &copy; {new Date().getFullYear()} ScaleInfra. Purpose-built for system architects.
          </p>
          <div className="flex items-center gap-6">
             <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-bold">Privacy</Link>
             <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-bold">Terms</Link>
             <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-bold">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
