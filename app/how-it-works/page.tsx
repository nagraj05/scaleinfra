"use client";

import React from "react";
import { Navbar } from "@/components/shared/navbar";
import { 
  Zap, 
  Cpu, 
  Database, 
  Layers, 
  Globe, 
  MessageSquare, 
  Activity, 
  ArrowRight,
  Info,
  BarChart3,
  Server,
  Layout,
  Network,
  Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  ReactFlow, 
  Background, 
  Edge, 
  Node,
  MarkerType
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "End Users (Inbound Traffic)" },
    position: { x: 250, y: 0 },
    style: { background: "#3b82f6", color: "#fff", border: "none", fontWeight: "900", borderRadius: "12px", padding: "12px", width: 200 },
  },
  {
    id: "2",
    data: { label: "API Gateway" },
    position: { x: 250, y: 100 },
    style: { background: "#a855f7", color: "#fff", border: "none", fontWeight: "900", borderRadius: "12px", padding: "12px", width: 200 },
  },
  {
    id: "3",
    data: { label: "App Server 1" },
    position: { x: 100, y: 200 },
    style: { background: "#f97316", color: "#fff", border: "none", fontWeight: "900", borderRadius: "12px", padding: "12px", width: 150 },
  },
  {
    id: "4",
    data: { label: "App Server 2" },
    position: { x: 400, y: 200 },
    style: { background: "#f97316", color: "#fff", border: "none", fontWeight: "900", borderRadius: "12px", padding: "12px", width: 150 },
  },
  {
    id: "5",
    data: { label: "Redis Cache" },
    position: { x: 550, y: 300 },
    style: { background: "#ef4444", color: "#fff", border: "none", fontWeight: "900", borderRadius: "12px", padding: "12px", width: 150 },
  },
  {
    id: "6",
    type: "output",
    data: { label: "PostgreSQL Database" },
    position: { x: 250, y: 400 },
    style: { background: "#2563eb", color: "#fff", border: "none", fontWeight: "900", borderRadius: "12px", padding: "12px", width: 200 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#3b82f6", strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" } },
  { id: "e2-3", source: "2", target: "3", animated: true, style: { stroke: "#a855f7", strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#a855f7" } },
  { id: "e2-4", source: "2", target: "4", animated: true, style: { stroke: "#a855f7", strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#a855f7" } },
  { id: "e3-6", source: "3", target: "6", animated: true, style: { stroke: "#f97316", strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#f97316" } },
  { id: "e4-5", source: "4", target: "5", animated: true, style: { stroke: "#f97316", strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#f97316" } },
  { id: "e5-6", source: "5", target: "6", animated: true, style: { stroke: "#ef4444", strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" } },
];

const Share2 = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.59 13.51 6.83 3.98" />
    <path d="m15.41 6.51-6.83 3.98" />
  </svg>
);

const components = [
  {
    category: "Client & Routing",
    items: [
      { name: "End Users", icon: Layout, desc: "The source of traffic. Generates requests based on a Poisson distribution to simulate real-world arrival patterns." },
      { name: "Load Balancer", icon: Layers, desc: "Distributes incoming traffic across multiple server instances to prevent individual bottlenecks." },
      { name: "API Gateway", icon: Share2, desc: "The entry point for all client requests, handling routing and initial processing." },
      { name: "CDN / Globe", icon: Globe, desc: "Caches content geographically closer to users to reduce base latency." }
    ]
  },
  {
    category: "Services & Logic",
    items: [
      { name: "Microservice", icon: Cpu, desc: "Standard processing unit with a defined Service Rate (μ). Can be scaled horizontally." },
      { name: "Worker", icon: Activity, desc: "Processes background tasks asynchronously, often pulling from a queue." },
      { name: "Server", icon: Server, desc: "General-purpose compute instance representing a physical or virtual machine." }
    ]
  },
  {
    category: "Storage & Caching",
    items: [
      { name: "Database (Postgres/Mongo)", icon: Database, desc: "Persistent storage. Usually the primary bottleneck due to disk I/O limits." },
      { name: "Redis Cache", icon: Zap, desc: "High-speed memory storage. Uses Cache Efficiency (h) to reduce downstream database load." },
      { name: "S3 Storage", icon: Box, desc: "Object storage for large files, typically with higher base latency but massive capacity." }
    ]
  },
  {
    category: "Messaging",
    items: [
      { name: "RabbitMQ / Kafka", icon: MessageSquare, desc: "Decouples services using message queues, allowing for asynchronous processing and load smoothing." }
    ]
  }
];

const mathConcepts = [
  {
    title: "Traffic Model (Poisson Distribution)",
    formula: "P(k) = (λ^k * e^-λ) / k!",
    layman: "In real life, users don't arrive at perfectly even intervals. They come in bursts. We use the Poisson distribution to simulate this 'random but predictable' arrival pattern, ensuring your simulation feels like real production traffic.",
    technical: "λ represents the average number of requests per second. Our engine samples this distribution every tick to generate realistic, bursty traffic.",
    definitions: [
      { symbol: "λ (Lambda)", name: "Arrival Rate", desc: "The average number of requests coming into the system per second." },
      { symbol: "k", name: "Actual Arrivals", desc: "The specific number of requests generated in a single simulation tick." },
      { symbol: "e", name: "Euler's Number", desc: "A mathematical constant (~2.718) used for growth models." }
    ]
  },
  {
    title: "The Bottleneck Formula (Usage)",
    formula: "ρ = λ / (c * μ)",
    layman: "Usage (Utilization) is simply how hard your servers are working. If you have 1000 requests coming in (λ) but your servers can only handle 800 (c*μ), your usage hits 125%—and your system starts failing.",
    technical: "When ρ > 1, the system is unstable and queues grow indefinitely. This is when users see '503 Service Unavailable' errors.",
    definitions: [
      { symbol: "ρ (Rho)", name: "Utilization", desc: "The total load factor of the system. 0% = Idle, 100% = Full Capacity." },
      { symbol: "c", name: "Server Count", desc: "The number of parallel server instances handling requests." },
      { symbol: "μ (Mu)", name: "Service Rate", desc: "How many requests a single server can process per second." }
    ]
  },
  {
    title: "Queuing Theory (Wait Times)",
    formula: "W = Wq + 1/μ",
    layman: "Latency isn't just processing time. It's 'Processing Time' + 'Waiting in Line'. As Usage approaches 100%, the 'Waiting Time' (Wq) increases exponentially. This is why systems slow down even before they crash.",
    technical: "We use the M/M/c Kendall notation for calculating waiting times. W is the total time a request spends in the system.",
    definitions: [
      { symbol: "W", name: "Total Latency", desc: "The total time from request start to completion (Response Time)." },
      { symbol: "Wq", name: "Queue Delay", desc: "The time a request spent waiting for a free server instance." },
      { symbol: "1/μ", name: "Service Time", desc: "The base time it takes to actually process the request logic." }
    ]
  }
];

const systemExamples = [
  {
    name: "Scalable Web API",
    description: "A standard highly-scalable setup with Load Balancer, Multiple App Servers, and a Redis Cache to protect the primary Database.",
    nodes: [
      { name: "Load Balancer", pos: "Top" },
      { name: "App Servers (c=5)", pos: "Middle" },
      { name: "Redis Cache (h=80%)", pos: "Middle-Right" },
      { name: "PostgreSQL", pos: "Bottom" }
    ],
    tip: "Always scale your App Servers horizontally (increase c) before upgrading your Database hardware."
  },
  {
    name: "Async Event Processing",
    description: "Decoupling heavy processing using Kafka and Background Workers to ensure consistent response times for the end user.",
    nodes: [
      { name: "API Gateway", pos: "Top" },
      { name: "Kafka Cluster", pos: "Middle" },
      { name: "Background Workers", pos: "Middle-Bottom" },
      { name: "Analytics DB", pos: "Bottom" }
    ],
    tip: "Message queues act as buffers during traffic spikes, protecting downstream services from being overwhelmed."
  }
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-32"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8">
              <Info className="w-4 h-4" /> The Science of Scaling
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-foreground leading-[0.9]">
              How it <span className="text-primary italic">Actually</span> Works.
            </h1>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto font-medium leading-relaxed">
              ScaleInfra isn&apos;t just a drawing tool. It&apos;s a formal mathematical simulator that uses Queuing Theory 
              and Statistical Distributions to predict how your system behaves under load.
            </p>
          </motion.div>

          {/* Core Math Section */}
          <section className="mb-48">
             <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 border-b border-border pb-8">
                <div>
                   <h2 className="text-4xl font-black tracking-tight text-foreground uppercase">The Mathematics</h2>
                   <p className="text-muted-foreground font-bold mt-2 uppercase tracking-widest text-xs">Behind every packet and every millisecond</p>
                </div>
                <div className="px-6 py-3 bg-muted/30 rounded-2xl border border-border text-xs font-bold text-muted-foreground italic">
                   Discrete-Time Simulation Engine (v2.0)
                </div>
             </div>

             <div className="grid md:grid-cols-3 gap-8">
                {mathConcepts.map((concept, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -10 }}
                    className="p-10 rounded-[40px] bg-card border border-border hover:border-primary/50 transition-all duration-500 shadow-xl relative overflow-hidden group flex flex-col"
                  >
                    {/* <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                       <BarChart3 className="w-32 h-32" />
                    </div> */}
                    <h3 className="text-2xl font-black mb-6 text-foreground tracking-tight">{concept.title}</h3>
                    <div className="bg-muted px-6 py-4 rounded-2xl font-mono text-primary text-lg font-bold mb-8 border border-primary/10">
                       {concept.formula}
                    </div>
                    
                    <div className="space-y-6 flex-grow">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Layman Terms</p>
                          <p className="text-muted-foreground text-sm font-bold leading-relaxed">{concept.layman}</p>
                       </div>
                       <div className="pt-4 border-t border-border">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Variable Definitions</p>
                          <div className="space-y-3">
                             {concept.definitions.map((def, j) => (
                               <div key={j} className="flex flex-col gap-0.5">
                                  <div className="flex items-center gap-2">
                                     <span className="text-xs font-mono font-black text-primary">{def.symbol}</span>
                                     <span className="text-[10px] font-black uppercase tracking-tight text-foreground/80">{def.name}</span>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground font-bold">{def.desc}</p>
                               </div>
                             ))}
                          </div>
                       </div>
                       <div className="pt-4 border-t border-border mt-auto">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-2">Technical Insight</p>
                          <p className="text-muted-foreground/60 text-[11px] font-bold leading-relaxed italic">{concept.technical}</p>
                       </div>
                    </div>
                  </motion.div>
                ))}
             </div>
          </section>

          {/* Component Guide */}
          <section className="mb-48 bg-muted/20 -mx-6 px-6 py-32 rounded-[60px] border border-border">
             <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-24">
                   <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-foreground">The Periodic Table of Infrastructure</h2>
                   <p className="text-muted-foreground text-xl font-medium">Every component has specific behavior models in our engine.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                   {components.map((cat, i) => (
                     <div key={i} className="space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary bg-primary/10 w-fit px-3 py-1 rounded-lg">
                           {cat.category}
                        </h4>
                        <div className="space-y-10">
                           {cat.items.map((item, j) => (
                             <div key={j} className="flex gap-5 group">
                                <div className="p-3.5 rounded-2xl bg-card border border-border group-hover:border-primary group-hover:bg-primary/5 transition-all h-fit shadow-sm">
                                   <item.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                   <h5 className="font-black text-foreground mb-2 tracking-tight">{item.name}</h5>
                                   <p className="text-[11px] text-muted-foreground font-bold leading-relaxed">{item.desc}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </section>

          {/* System Design Examples */}
          <section className="mb-48">
             <div className="text-center mb-24">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-foreground uppercase">Pro Blueprints</h2>
                <p className="text-muted-foreground text-xl font-medium">Proven patterns for high-performance systems.</p>
             </div>

             <div className="grid md:grid-cols-2 gap-16">
                {systemExamples.map((ex, i) => (
                  <div key={i} className="group cursor-default">
                     <div className="relative p-12 rounded-[50px] bg-card border border-border group-hover:border-primary/30 transition-all duration-500 overflow-hidden shadow-2xl">
                        {/* <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                           <Network className="w-64 h-64" />
                        </div> */}
                        <h3 className="text-3xl font-black mb-4 text-foreground tracking-tight">{ex.name}</h3>
                        <p className="text-muted-foreground font-bold leading-relaxed mb-10">{ex.description}</p>
                        
                        <div className="space-y-4 mb-12">
                           {ex.nodes.map((node, j) => (
                             <div key={j} className="flex items-center gap-4 bg-muted/40 px-6 py-4 rounded-2xl border border-border group-hover:translate-x-2 transition-transform duration-500" style={{ transitionDelay: `${j * 100}ms` }}>
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                <span className="text-sm font-black text-foreground uppercase tracking-widest">{node.name}</span>
                                <span className="ml-auto text-[10px] font-black text-muted-foreground uppercase opacity-50">{node.pos}</span>
                             </div>
                           ))}
                        </div>

                        <div className="p-6 rounded-3xl bg-secondary/50 border border-border">
                           <div className="flex items-center gap-3 text-secondary-foreground mb-2">
                              <Zap className="w-4 h-4 fill-primary text-primary" />
                              <span className="text-xs font-black uppercase tracking-widest">Architect Tip</span>
                           </div>
                           <p className="text-sm text-muted-foreground/80 font-bold italic leading-relaxed">{ex.tip}</p>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </section>

          {/* Interactive Blueprint Section */}
          <section className="mb-48">
             <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-foreground uppercase">Live Blueprint Demo</h2>
                <p className="text-muted-foreground text-lg font-medium">A glimpse into how nodes connect and interact in real-time.</p>
             </div>
             
             <div className="h-[600px] w-full rounded-[40px] border border-border bg-muted/10 relative overflow-hidden shadow-2xl">
                <ReactFlow
                   nodes={initialNodes}
                   edges={initialEdges}
                   fitView
                   nodesDraggable={false}
                   nodesConnectable={false}
                   elementsSelectable={false}
                   panOnDrag={false}
                   zoomOnScroll={false}
                   preventScrolling={false}
                   className="grayscale-[0.5] hover:grayscale-0 transition-all duration-700"
                >
                   <Background color="#333" gap={20} />
                </ReactFlow>
                
                {/* Overlay Info */}
                <div className="absolute bottom-10 left-10 p-6 rounded-3xl bg-background/80 backdrop-blur-md border border-border shadow-xl max-w-xs z-10">
                   <div className="flex items-center gap-2 text-primary mb-2">
                      <Zap size={14} className="fill-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Simulation Feed</span>
                   </div>
                   <p className="text-xs text-muted-foreground font-bold leading-relaxed">
                      In the actual dashboard, these connections carry real Poisson-distributed traffic flows!
                   </p>
                </div>
             </div>
          </section>

          {/* CTA / Final Word */}
          <section className="text-center p-20 rounded-[60px] bg-primary relative overflow-hidden group">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,0,0,0.1),transparent)] opacity-50"></div>
             <div className="relative z-10">
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-primary-foreground mb-10">Stop guessing. <br/> Start simulating.</h2>
                <Button asChild size="lg" className="h-16 px-12 bg-white text-primary border-none hover:bg-opacity-90 transition-all shadow-2xl rounded-[20px] font-black text-lg">
                   <a href="/dashboard" className="flex items-center gap-4">
                      Open Explorer <ArrowRight className="w-6 h-6" />
                   </a>
                </Button>
             </div>
          </section>
        </div>
      </main>

      {/* Footer (Simplified for this page) */}
      <footer className="py-24 border-t border-border mt-32">
         <div className="container mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-12">
               <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center font-mono font-black text-2xl text-primary-foreground">S</div>
               <span className="font-black text-3xl tracking-tighter text-foreground uppercase">ScaleInfra</span>
            </div>
            <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-[10px]">
               Built for Architecture. Powered by Math. 
            </p>
         </div>
      </footer>
    </div>
  );
}
