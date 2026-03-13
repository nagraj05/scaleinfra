import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Cpu, Zap, AlertTriangle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface NodeConfigProps {
  node: any;
  onUpdate: (id: string, config: any) => void;
}

export function NodeConfig({ node, onUpdate }: NodeConfigProps) {
  if (!node) return null;

  const config = node.data.config || {
    capacity: 1000,
    latency: 50,
    errorRate: 0,
    load: node.data.type === 'client' ? 100 : 0
  };

  const handleChange = (key: string, value: number) => {
    onUpdate(node.id, {
      ...config,
      [key]: value
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
        <div className="p-3 rounded-lg bg-background border shadow-sm">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-sm leading-none">{node.data.label}</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
            {node.data.type.replace('_', ' ')} Settings
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-0">
          {node.data.type === 'client' && (
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <Label className="text-sm font-bold">Request Rate</Label>
                  <p className="text-[10px] text-muted-foreground">Traffic volume from this client</p>
                </div>
                <span className="text-sm font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">
                  {config.load} <span className="text-[8px] opacity-70">RPM</span>
                </span>
              </div>
              <Slider 
                value={[config.load]} 
                min={0} 
                max={5000} 
                step={10} 
                onValueChange={([val]) => handleChange('load', val)}
                className="py-2"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <Label className="text-sm font-bold flex items-center gap-2">
                  <Cpu className="w-3 h-3" /> Capacity
                </Label>
                <p className="text-[10px] text-muted-foreground">Max requests processed per minute</p>
              </div>
              <span className="text-sm font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">
                {config.capacity} <span className="text-[8px] opacity-70">RPM</span>
              </span>
            </div>
            <Slider 
              value={[config.capacity]} 
              min={100} 
              max={10000} 
              step={100} 
              onValueChange={([val]) => handleChange('capacity', val)}
              className="py-2"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <Label className="text-sm font-bold flex items-center gap-2">
                  <Zap className="w-3 h-3" /> Latency
                </Label>
                <p className="text-[10px] text-muted-foreground">Delay added to each request</p>
              </div>
              <span className="text-sm font-mono text-sky-500 font-bold bg-sky-500/10 px-2 py-0.5 rounded">
                {config.latency} <span className="text-[8px] opacity-70">MS</span>
              </span>
            </div>
            <Slider 
              value={[config.latency]} 
              min={1} 
              max={1000} 
              step={1} 
              onValueChange={([val]) => handleChange('latency', val)}
              className="py-2"
            />
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6 mt-0">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <Label className="text-sm font-bold flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-3 h-3" /> Innate Error Rate
                </Label>
                <p className="text-[10px] text-muted-foreground">Probability of random failure</p>
              </div>
              <span className="text-sm font-mono text-destructive font-bold bg-destructive/10 px-2 py-0.5 rounded">
                {config.errorRate}%
              </span>
            </div>
            <Slider 
              value={[config.errorRate]} 
              min={0} 
              max={100} 
              step={1} 
              onValueChange={([val]) => handleChange('errorRate', val)}
              className="py-2"
            />
          </div>

          <Separator />
          
          <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/10">
             <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1 flex items-center gap-2">
               <AlertTriangle size={10} /> Architecture Warning
             </p>
             <p className="text-[10px] text-muted-foreground leading-relaxed">
               High latency or low capacity in core components often leads to cascading failures downstream.
             </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
