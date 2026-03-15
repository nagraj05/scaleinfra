"use client";

import { Handle, Position } from "@xyflow/react";
import {
  Terminal,
  Cpu,
  Database,
  Cloud,
  HardDrive,
  Share2,
  Layers,
  Zap,
  Settings2,
  Box,
  Shield,
  CreditCard,
  MessageSquare,
  ArrowRightLeft,
  Server,
  Globe,
  Search,
  Network,
  BarChart3,
  Mail,
  Smartphone,
  Bell,
  LineChart,
  Activity,
  Clock,
  RotateCcw,
  FileText,
  GitBranch,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  client: Terminal,
  microservice: Cpu,
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
  cloud: Cloud,
  cdn: Globe,
  dns: Search,
  firewall: Shield,
  vpc: Network,
  container: Box,
  email_service: Mail,
  sms_service: Smartphone,
  notification_service: Bell,
  search_service: Search,
  analytics_service: LineChart,
  s3: HardDrive,
  elasticsearch: Search,
  cassandra: Database,
  clickhouse: BarChart3,
  worker: Activity,
  cron: Clock,
  websocket: RotateCcw,
  monitoring: Activity,
  logging: FileText,
  tracing: GitBranch,
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
  cloud: "text-sky-500 bg-sky-500/10 border-sky-500/20",
  cdn: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  dns: "text-slate-400 bg-slate-400/10 border-slate-400/20",
  firewall: "text-rose-600 bg-rose-600/10 border-rose-600/20",
  vpc: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
  container: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  email_service: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  sms_service: "text-green-500 bg-green-500/10 border-green-500/20",
  notification_service: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  search_service: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  analytics_service: "text-violet-500 bg-violet-500/10 border-violet-500/20",
  s3: "text-amber-600 bg-amber-600/10 border-amber-600/20",
  elasticsearch: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
  cassandra: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  clickhouse: "text-red-500 bg-red-500/10 border-red-500/20",
  worker: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  cron: "text-slate-500 bg-slate-500/10 border-slate-500/20",
  websocket: "text-teal-500 bg-teal-500/10 border-teal-500/20",
  monitoring: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  logging: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  tracing: "text-purple-400 bg-purple-400/10 border-purple-400/20",
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
      <div className="absolute -top-3 -right-2 flex gap-1 opacity-0 group-hover/node:opacity-100 transition-opacity z-10">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            data.onOpenSettings?.(id);
          }}
          className="p-1.5 bg-background border rounded-full shadow-sm hover:border-primary hover:text-primary transition-all active:scale-95"
          title="Settings"
        >
          <Settings2 size={13} />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            data.onDelete?.(id);
          }}
          className="p-1.5 bg-background border rounded-full shadow-sm hover:border-destructive hover:text-destructive transition-all active:scale-95"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Metrics Overlay */}
      {data.isRunning && (
        <div className="absolute -top-14 left-0 right-0 flex flex-col items-center pointer-events-none">
          <div className="bg-background/90 backdrop-blur-sm border rounded px-2 py-1 flex gap-3 shadow-sm border-primary/20">
            <div className="flex flex-col items-center">
              <span className="text-[8px] uppercase text-muted-foreground font-bold">Load</span>
              <span className={cn("text-xs font-mono font-bold", metrics.rpm > 0 ? "text-primary" : "text-muted-foreground")}>
                {Math.round(metrics.rpm)}
              </span>
            </div>
            <div className="flex flex-col items-center border-l pl-3">
              <span className="text-[8px] uppercase text-muted-foreground font-bold">Usage</span>
              <span className={cn("text-xs font-mono font-bold", metrics.utilization >= 1 ? "text-destructive" : "text-emerald-500")}>
                {Math.round(metrics.utilization * 100)}%
              </span>
            </div>
            <div className="flex flex-col items-center border-l pl-3">
              <span className="text-[8px] uppercase text-muted-foreground font-bold">Latency</span>
              <span className="text-xs font-mono font-bold text-sky-500">
                {metrics.latency}ms
              </span>
            </div>
            {metrics.queueLength > 0 && (
              <div className="flex flex-col items-center border-l pl-3">
                <span className="text-[8px] uppercase text-orange-500 font-bold">Waiting</span>
                <span className="text-xs font-mono font-bold text-orange-500">
                  {Math.round(metrics.queueLength)}
                </span>
              </div>
            )}
            {metrics.errorRate > 0 && (
              <div className="flex flex-col items-center border-l pl-3">
                <span className="text-[8px] uppercase text-destructive font-bold">Errors</span>
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
