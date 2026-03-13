import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Cpu, Zap, AlertTriangle, Activity, Terminal } from "lucide-react";

interface NodeConfigProps {
  node: any;
  onUpdate: (id: string, data: any) => void;
}

export function NodeConfig({ node, onUpdate }: NodeConfigProps) {
  if (!node) return null;

  const config = node.data.config || {
    capacity: 1000,
    latency: 50,
    errorRate: 0,
    load: node.data.type === "client" ? 100 : 0,
  };

  const handleChange = (key: string, value: number) => {
    onUpdate(node.id, {
      ...node.data,
      config: {
        ...config,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-5 p-5 rounded-2xl bg-muted/30 border border-border shadow-2xl">
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
                    Active Users / Load
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
                Simulates the number of requests per second initiated by users.
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
                  Throughput
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
          </div>

          <Separator className="bg-border mt-8" />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <Cpu className="w-5 h-5 text-sky-500" />
                </div>
                <label className="text-xs font-black uppercase tracking-widest text-foreground">
                  Latency
                </label>
              </div>
              <span className="text-sm font-black text-sky-500 font-mono tracking-tighter">
                {config.latency}ms
              </span>
            </div>
            <Slider
              value={[config.latency]}
              min={1}
              max={1000}
              step={1}
              onValueChange={([val]) => handleChange("latency", val)}
              className="py-4 cursor-pointer"
            />
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
                  Error Rate
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
              <AlertTriangle className="w-3.5 h-3.5" /> Architecture Guard
            </h4>
            <p className="text-[11px] text-muted-foreground font-bold leading-relaxed relative z-10">
              System stability is a function of latency and capacity. Ensure
              your nodes are sized correctly to handle peak loads without
              cascading failure.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
