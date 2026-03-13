"use client";

import {
  Terminal,
  Cpu,
  Database,
  Share2,
  Zap,
  Cloud,
  Layers,
  HardDrive,
  Shield,
  CreditCard,
  Box,
  MessageSquare,
  ArrowRightLeft,
  Server,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const elements = [
  {
    type: "client",
    label: "Users",
    icon: Terminal,
    color: "text-blue-500",
    category: "Client",
  },
  {
    type: "api_gateway",
    label: "API Gateway",
    icon: Share2,
    color: "text-purple-500",
    category: "Routing",
  },
  {
    type: "lb",
    label: "Load Balancer",
    icon: Layers,
    color: "text-rose-500",
    category: "Routing",
  },
  {
    type: "microservice",
    label: "Microservice",
    icon: Box,
    color: "text-primary",
    category: "Services",
  },
  {
    type: "auth_service",
    label: "Auth Service",
    icon: Shield,
    color: "text-indigo-500",
    category: "Services",
  },
  {
    type: "payment_service",
    label: "Payment Service",
    icon: CreditCard,
    color: "text-emerald-500",
    category: "Services",
  },
  {
    type: "redis",
    label: "Redis Cache",
    icon: Zap,
    color: "text-orange-500",
    category: "Storage",
  },
  {
    type: "postgres",
    label: "PostgreSQL",
    icon: Database,
    color: "text-blue-600",
    category: "Storage",
  },
  {
    type: "mongodb",
    label: "MongoDB",
    icon: Database,
    color: "text-green-600",
    category: "Storage",
  },
  {
    type: "rabbitmq",
    label: "RabbitMQ",
    icon: MessageSquare,
    color: "text-orange-600",
    category: "Messaging",
  },
  {
    type: "kafka",
    label: "Kafka",
    icon: ArrowRightLeft,
    color: "text-slate-400",
    category: "Messaging",
  },
];

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-80 border-r bg-card h-full p-8 overflow-y-auto custom-scrollbar">
      <div className="space-y-1 mb-10">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
          Components
        </h3>
        <p className="text-[10px] text-muted-foreground font-bold">
          DRAG AND DROP TO START
        </p>
      </div>

      <div className="grid gap-4">
        {elements.map((el) => (
          <div
            key={el.type}
            className="group cursor-grab active:cursor-grabbing"
            onDragStart={(event) => onDragStart(event, el.type)}
            draggable
          >
            <Card className="p-4 flex items-center gap-5 hover:border-primary/50 transition-all duration-300 border-border bg-muted/30 hover:bg-muted/50 rounded-2xl group shadow-sm">
              <div
                className={`p-3 rounded-xl bg-background border border-border ${el.color} group-hover:border-primary/30 group-hover:shadow-[0_0_15px_rgba(var(--primary),0.1)] transition-all`}
              >
                <el.icon size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
                  {el.label}
                </span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">
                  System Node
                </span>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <div className="mt-16 p-6 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2 relative z-10">
          <Zap size={12} className="fill-primary" /> Pro Guide
        </p>
        <p className="text-[11px] text-muted-foreground leading-relaxed font-bold relative z-10">
          Construct complex architectures by linking nodes. Top handles
          represent outputs, bottom handles represent inputs.
        </p>
      </div>
    </aside>
  );
}
