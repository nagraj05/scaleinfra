"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Cpu, Zap, AlertTriangle, Activity, Terminal, Layers } from "lucide-react";

interface NodeConfigProps {
  node: any;
  onUpdate: (id: string, config: any) => void;
}

export function NodeConfig({ node, onUpdate }: NodeConfigProps) {
  if (!node) return null;

  const config = node.data.config || {
    capacity: 1000,
    latency: 50,
    instances: 1,
    errorRate: 0,
    load: node.data.type === "client" ? 100 : 0,
    cacheHitRate: 0,
  };

  const handleChange = (key: string, value: number) => {
    // We only send the partial config change, SimulatorBoard handles the merge
    onUpdate(node.id, { [key]: value });
  };

  return (
    <ScrollArea className="h-full pr-4 pb-8">
      <div className="space-y-10 p-1 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-5 p-5 rounded-2xl bg-muted/30 border border-border shadow-md">
          <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.1)]">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-black text-lg leading-none text-foreground tracking-tight uppercase">
              {node.data.label}
            </h3>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-1.5 opacity-70">
              {node.data.type?.replace("_", " ")} CONFIGURATION
            </p>
          </div>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-14 bg-muted border border-border rounded-2xl p-1.5">
            <TabsTrigger
              value="general"
              className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="general"
            className="mt-10 space-y-10 animate-in fade-in slide-in-from-top-2 duration-500"
          >
            {node.data.type === "client" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <Terminal className="w-5 h-5 text-blue-500" />
                    </div>
                    <label className="text-xs font-black uppercase tracking-widest text-foreground">
                      Inbound Traffic
                    </label>
                  </div>
                  <span className="text-sm font-black text-blue-500 font-mono tracking-tighter">
                    {config.load} req/s
                  </span>
                </div>
                <Slider
                  value={[config.load]}
                  min={0}
                  max={10000}
                  step={50}
                  onValueChange={([val]) => handleChange("load", val)}
                  className="py-4 cursor-pointer"
                />
                <p className="text-[10px] text-muted-foreground font-bold italic">
                  λ: Poisson arrival rate for traffic generation.
                </p>
                <Separator className="bg-border mt-8" />
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <label className="text-xs font-black uppercase tracking-widest text-foreground">
                    Processing Speed
                  </label>
                </div>
                <span className="text-sm font-black text-primary font-mono tracking-tighter">
                  {config.capacity} req/s
                </span>
              </div>
              <Slider
                value={[config.capacity]}
                min={100}
                max={10000}
                step={100}
                onValueChange={([val]) => handleChange("capacity", val)}
                className="py-4 cursor-pointer"
              />
              <p className="text-[10px] text-muted-foreground font-bold italic">
                μ: Peak service rate per instance.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <Layers className="w-5 h-5 text-purple-500" />
                  </div>
                  <label className="text-xs font-black uppercase tracking-widest text-foreground">
                    Server Count
                  </label>
                </div>
                <span className="text-sm font-black text-purple-500 font-mono tracking-tighter">
                  {config.instances}
                </span>
              </div>
              <Slider
                value={[config.instances]}
                min={1}
                max={50}
                step={1}
                onValueChange={([val]) => handleChange("instances", val)}
                className="py-4 cursor-pointer"
              />
              <p className="text-[10px] text-muted-foreground font-bold italic">
                C: Number of processing nodes for M/M/C model.
              </p>
            </div>

            {(node.data.type === 'cache' || node.data.type === 'redis' || node.data.type === 'cdn') && (
              <>
                <Separator className="bg-border mt-8" />
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <Activity className="w-5 h-5 text-emerald-500" />
                      </div>
                      <label className="text-xs font-black uppercase tracking-widest text-foreground">
                        Cache Efficiency
                      </label>
                    </div>
                    <span className="text-sm font-black text-emerald-500 font-mono tracking-tighter">
                      {config.cacheHitRate}%
                    </span>
                  </div>
                  <Slider
                    value={[config.cacheHitRate]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([val]) => handleChange("cacheHitRate", val)}
                    className="py-4 cursor-pointer"
                  />
                  <p className="text-[10px] text-muted-foreground font-bold italic">
                    h: Hit probability (traffic reduction to dependencies).
                  </p>
                </div>
              </>
            )}

            <Separator className="bg-border mt-8" />

            <div className="space-y-6 p-4 rounded-xl bg-accent/50 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
                    <Cpu className="w-5 h-5 text-sky-500" />
                  </div>
                  <label className="text-xs font-black uppercase tracking-widest text-foreground">
                    Theoretical Metrics
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase text-muted-foreground font-black tracking-tighter">Service Time (S)</span>
                  <span className="text-lg font-black font-mono tracking-tighter text-sky-500">{Math.round(1000 / config.capacity)}ms</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase text-muted-foreground font-black tracking-tighter">Total Capacity</span>
                  <span className="text-lg font-black font-mono tracking-tighter text-sky-500">{config.capacity * config.instances} rps</span>
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground font-bold italic mt-4">
                Based on S = 1/μ. Real-time performance will include queuing delay (Wq).
              </p>
            </div>
          </TabsContent>

          <TabsContent
            value="advanced"
            className="mt-10 space-y-10 animate-in fade-in slide-in-from-top-2 duration-500"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                  </div>
                  <label className="text-xs font-black uppercase tracking-widest text-foreground">
                    Failure Probability
                  </label>
                </div>
                <span className="text-sm font-black text-rose-500 font-mono tracking-tighter">
                  {config.errorRate}%
                </span>
              </div>
              <Slider
                value={[config.errorRate]}
                min={0}
                max={100}
                step={1}
                onValueChange={([val]) => handleChange("errorRate", val)}
                className="py-4 cursor-pointer"
              />
            </div>

            <div className="p-6 rounded-[24px] bg-rose-500/5 border border-rose-500/10 mt-10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-2 flex items-center gap-2 relative z-10">
                <AlertTriangle className="w-3.5 h-3.5" /> Stability Analysis
              </h4>
              <p className="text-[11px] text-muted-foreground font-bold leading-relaxed relative z-10">
                ρ = λ / (c*μ). If ρ ≥ 1, the queue grows indefinitely (ΔQ = λ - μ).
                System stability requires ρ &lt; 0.7 for healthy operation.
              </p>
            </div>

            <div className="p-6 rounded-[24px] bg-primary/5 border border-primary/10 mt-6 relative overflow-hidden">
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" /> M/M/c Model
              </h4>
              <p className="text-[11px] text-muted-foreground font-bold leading-relaxed">
                Using Little's Law and Erlang-C formulas for multi-server queueing simulation.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
