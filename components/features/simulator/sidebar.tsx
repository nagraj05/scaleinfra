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
  StickyNote,
  Maximize,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const elements = [
  {
    type: "client",
    label: "End Users",
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
    type: "cloud",
    label: "Cloud Region",
    icon: Cloud,
    color: "text-sky-500",
    category: "Infrastructure",
  },
  {
    type: "cdn",
    label: "CDN",
    icon: Globe,
    color: "text-blue-400",
    category: "Infrastructure",
  },
  {
    type: "dns",
    label: "DNS Resolver",
    icon: Search,
    color: "text-slate-400",
    category: "Infrastructure",
  },
  {
    type: "firewall",
    label: "Firewall",
    icon: Shield,
    color: "text-rose-600",
    category: "Infrastructure",
  },
  {
    type: "vpc",
    label: "VPC / Network",
    icon: Network,
    color: "text-indigo-400",
    category: "Infrastructure",
  },
  {
    type: "container",
    label: "K8s Container",
    icon: Box,
    color: "text-blue-500",
    category: "Infrastructure",
  },
  {
    type: "server",
    label: "App Server",
    icon: Server,
    color: "text-orange-400",
    category: "Services",
  },
  {
    type: "microservice",
    label: "Microservice",
    icon: Cpu,
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
    type: "email_service",
    label: "Email API",
    icon: Mail,
    color: "text-amber-500",
    category: "Services",
  },
  {
    type: "sms_service",
    label: "SMS Gateway",
    icon: Smartphone,
    color: "text-green-500",
    category: "Services",
  },
  {
    type: "notification_service",
    label: "Push Notif",
    icon: Bell,
    color: "text-yellow-500",
    category: "Services",
  },
  {
    type: "search_service",
    label: "Search Engine",
    icon: Search,
    color: "text-orange-500",
    category: "Services",
  },
  {
    type: "analytics_service",
    label: "Analytics",
    icon: LineChart,
    color: "text-violet-500",
    category: "Services",
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
    type: "redis",
    label: "Redis Cache",
    icon: Zap,
    color: "text-orange-500",
    category: "Storage",
  },
  {
    type: "s3",
    label: "S3 / Object Store",
    icon: HardDrive,
    color: "text-amber-600",
    category: "Storage",
  },
  {
    type: "elasticsearch",
    label: "Elasticsearch",
    icon: Search,
    color: "text-cyan-500",
    category: "Storage",
  },
  {
    type: "cassandra",
    label: "Cassandra",
    icon: Database,
    color: "text-blue-400",
    category: "Storage",
  },
  {
    type: "clickhouse",
    label: "Clickhouse",
    icon: BarChart3,
    color: "text-red-500",
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
    label: "Kafka Cluster",
    icon: ArrowRightLeft,
    color: "text-slate-400",
    category: "Messaging",
  },
  {
    type: "worker",
    label: "Background Worker",
    icon: Activity,
    color: "text-emerald-400",
    category: "Async",
  },
  {
    type: "cron",
    label: "Scheduled Job",
    icon: Clock,
    color: "text-slate-500",
    category: "Async",
  },
  {
    type: "websocket",
    label: "WebSocket Server",
    icon: RotateCcw,
    color: "text-teal-500",
    category: "Async",
  },
  {
    type: "monitoring",
    label: "Prometheus",
    icon: Activity,
    color: "text-orange-500",
    category: "Observability",
  },
  {
    type: "logging",
    label: "Loki / ELK",
    icon: FileText,
    color: "text-amber-400",
    category: "Observability",
  },
  {
    type: "tracing",
    label: "Jaeger / Tracing",
    icon: GitBranch,
    color: "text-purple-400",
    category: "Observability",
  },
  {
    type: "annotation",
    label: "Sticky Note",
    icon: StickyNote,
    color: "text-yellow-400",
    category: "Other",
  },
  {
    type: "group",
    label: "Cluster / Group",
    icon: Maximize,
    color: "text-slate-400",
    category: "Other",
  },
];

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const categories = Array.from(new Set(elements.map((el) => el.category)));

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

      <div className="space-y-10">
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 border-b border-border pb-2">
              {category}
            </h4>
            <div className="grid gap-3">
              {elements
                .filter((el) => el.category === category)
                .map((el) => (
                  <div
                    key={el.type}
                    className="group cursor-grab active:cursor-grabbing"
                    onDragStart={(event) => onDragStart(event, el.type)}
                    draggable
                  >
                    <Card className="p-3.5 flex items-center gap-4 hover:border-primary/50 transition-all duration-300 border-border bg-muted/20 hover:bg-muted/40 rounded-xl group shadow-none hover:shadow-lg hover:shadow-primary/5">
                      <div
                        className={`p-2.5 rounded-lg bg-background border border-border ${el.color} group-hover:border-primary/30 transition-all`}
                      >
                        <el.icon size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
                          {el.label}
                        </span>
                      </div>
                    </Card>
                  </div>
                ))}
            </div>
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
