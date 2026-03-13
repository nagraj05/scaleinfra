"use client";

import { Handle, Position } from "@xyflow/react";
import { Terminal, Cpu, Database, Cloud, HardDrive, Share2, Layers, Zap, Settings2, Box, Shield, CreditCard, MessageSquare, ArrowRightLeft, Server } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  client: Terminal,
  microservice: Box,
  auth_service: Shield,
  payment_service: CreditCard,
  postgres: Database,
  mongodb: Database,
  redis: Zap,
  rabbitmq: MessageSquare,
  kafka: ArrowRightLeft,
  api_gateway: Share2,
  lb: Layers,
  server: Server,
};

const colorMap = {
  client: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  microservice: "text-primary bg-primary/10 border-primary/20",
  auth_service: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
  payment_service: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  postgres: "text-blue-600 bg-blue-600/10 border-blue-600/20",
  mongodb: "text-green-600 bg-green-600/10 border-green-600/20",
  redis: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  rabbitmq: "text-orange-600 bg-orange-600/10 border-orange-600/20",
  kafka: "text-slate-400 bg-slate-400/10 border-slate-400/20",
  api_gateway: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  lb: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  server: "text-primary bg-primary/10 border-primary/20",
};

export function SystemNode({ id, data, selected }: any) {
  const Icon = iconMap[data.type as keyof typeof iconMap] || Cpu;
  const colors = colorMap[data.type as keyof typeof colorMap] || colorMap.server;

  const metrics = data.metrics || { rpm: 0, latency: 0, errorRate: 0 };
  const isBottleneck = metrics.rpm > (data.config?.capacity || 1000) * 0.9;

  return (
    <div className={cn(
      "px-4 py-2 shadow-md rounded-md bg-card border-2 transition-all min-w-[170px] relative group/node",
      selected ? "border-primary shadow-lg ring-1 ring-primary/50" : "border-border",
      data.isRunning ? "ring-2 ring-primary/20" : "",
      isBottleneck ? "border-destructive animate-pulse" : ""
    )}>
      {/* Settings Trigger */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          data.onOpenSettings?.(id);
        }}
        className="absolute -top-2 -right-2 p-1 bg-background border rounded-full shadow-sm opacity-0 group-hover/node:opacity-100 transition-opacity hover:border-primary hover:text-primary z-10"
      >
        <Settings2 size={12} />
      </button>

      {/* Metrics Overlay */}
      {data.isRunning && (
        <div className="absolute -top-12 left-0 right-0 flex flex-col items-center pointer-events-none">
          <div className="bg-background/90 backdrop-blur-sm border rounded px-2 py-1 flex gap-3 shadow-sm border-primary/20">
            <div className="flex flex-col items-center">
              <span className="text-[8px] uppercase text-muted-foreground font-bold">RPM</span>
              <span className={cn("text-xs font-mono font-bold", metrics.rpm > 0 ? "text-primary" : "text-muted-foreground")}>
                {Math.round(metrics.rpm)}
              </span>
            </div>
            <div className="flex flex-col items-center border-l pl-3">
              <span className="text-[8px] uppercase text-muted-foreground font-bold">Lat</span>
              <span className="text-xs font-mono font-bold text-sky-500">
                {metrics.latency}ms
              </span>
            </div>
            {metrics.errorRate > 0 && (
              <div className="flex flex-col items-center border-l pl-3">
                <span className="text-[8px] uppercase text-destructive font-bold">ERR</span>
                <span className="text-xs font-mono font-bold text-destructive">
                  {Math.round(metrics.errorRate * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-muted-foreground border-none" />
      
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg border", colors)}>
          <Icon size={18} />
        </div>
        <div className="flex-grow">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{data.type.replace('_', ' ')}</div>
          <div className="text-sm font-semibold">{data.label}</div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-primary border-none" />
    </div>
  );
}
