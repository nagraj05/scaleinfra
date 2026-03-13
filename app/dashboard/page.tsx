"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { Plus, Layout, Clock, ChevronRight, Trash2, Box, ExternalLink, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useState, useMemo } from "react";
import { CreateSimulationModal } from "@/components/features/dashboard/create-simulation-modal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createSupabaseClient } from "@/lib/supabase";
import { SimulationSkeleton } from "@/components/skeletons/simulation-skeleton";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch simulations
  const { data: simulations, isLoading } = useQuery({
    queryKey: ["simulations", user?.id],
    queryFn: async () => {
      const token = await getToken({ template: "supabase" });
      const supabase = createSupabaseClient(token || undefined);
      
      const { data, error } = await supabase
        .from("simulations")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this simulation?")) return;

    try {
      const token = await getToken({ template: "supabase" });
      const supabase = createSupabaseClient(token || undefined);
      
      const { error } = await supabase
        .from("simulations")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast.success("Simulation deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["simulations", user?.id] });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete simulation");
    }
  };

  const quotaColor = simulations?.length && simulations.length >= 3 ? "text-destructive" : "text-primary";

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-foreground">
      <Navbar />
      <main className="flex-grow pt-28 px-4 sm:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-border/50 pb-8">
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                Applications
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                Manage your system design simulations and cloud environments.
              </p>
            </div>
            
            {/* Subtle Quota Counter */}
            <div className="flex items-center gap-6 bg-card/50 px-6 py-3 rounded-2xl border border-border/50 backdrop-blur-sm self-start md:self-auto">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold leading-none">Usage Quota</p>
                <div className="flex items-baseline gap-1">
                  <span className={cn("text-2xl font-black leading-none", quotaColor)}>{simulations?.length || 0}</span>
                  <span className="text-muted-foreground text-xs font-bold leading-none">/ 3 Simulations</span>
                </div>
              </div>
              <div className="h-10 w-[1px] bg-border/50" />
              <div className="w-24 bg-muted/30 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-500", simulations?.length && simulations.length >= 3 ? "bg-destructive" : "bg-primary")}
                  style={{ width: `${Math.min(((simulations?.length || 0) / 3) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Create Card (Clerk Style) */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group relative flex flex-col items-center justify-center h-[260px] rounded-[24px] border-2 border-dashed border-border/60 bg-card/10 hover:bg-card/30 hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 group-hover:text-primary transition-all duration-300">
                <Plus className="w-6 h-6" />
              </div>
              <span className="mt-4 font-bold text-sm text-muted-foreground group-hover:text-foreground transition-colors">Create simulation</span>
            </button>

            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[260px] rounded-[24px] bg-card/50 border border-border/50 animate-pulse" />
              ))
            ) : simulations?.map((sim) => (
              <div key={sim.id} className="group relative pr-[2px] pb-[2px]">
                {/* Thin Gradient Highlight line at top (Clerk style) */}
                <div className="absolute top-6 left-12 right-12 h-[2px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity blur-[2px] rounded-full" />
                
                <Link href={`/simulator/${sim.id}`}>
                  <Card className="h-[260px] rounded-[24px] border border-border/50 bg-card/30 hover:bg-card/50 hover:border-primary/30 transition-all duration-300 flex flex-col overflow-hidden">
                    <CardHeader className="p-6 pb-2">
                       <div className="flex items-center justify-between mb-4">
                         <div className="w-10 h-10 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center group-hover:border-primary/30 group-hover:text-primary transition-all">
                           <Box className="w-5 h-5" />
                         </div>
                         <div className="flex items-center gap-2">
                           <div className="px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-bold text-primary tracking-wider uppercase">
                             Active Design
                           </div>
                           <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                              onClick={(e) => handleDelete(e, sim.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                         </div>
                       </div>
                       
                       <div className="space-y-1 text-left">
                         <CardTitle className="text-xl font-black truncate group-hover:text-primary transition-colors leading-tight">
                           {sim.name}
                         </CardTitle>
                         <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/30 border border-border/30 w-fit">
                            <span className="w-1 h-1 rounded-full bg-yellow-500 animate-pulse" />
                            <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[150px]">
                              {sim.id.split('-')[0]}.sim.environment
                            </span>
                         </div>
                       </div>
                    </CardHeader>

                    <CardContent className="px-6 pt-4 mt-auto border-t border-border/20 bg-muted/5 flex items-center justify-between">
                       <div className="flex flex-col">
                         <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-black">Last updated</span>
                         <span className="text-[10px] font-bold text-foreground/70">{new Date(sim.created_at).toLocaleDateString()}</span>
                       </div>
                       <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0" />
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>

          {!isLoading && (!simulations || simulations.length === 0) && (
            <div className="mt-12 p-12 rounded-[32px] border border-border/50 bg-card/20 text-center space-y-4">
               <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center mx-auto opacity-40">
                 <AlertCircle className="w-8 h-8" />
               </div>
               <div className="space-y-1">
                 <h3 className="text-xl font-bold">No simulations found</h3>
                 <p className="text-muted-foreground text-sm max-w-md mx-auto">
                   Start by creating a new simulation to visualize and stress-test your system architecture.
                 </p>
               </div>
            </div>
          )}
        </div>
      </main>

      <CreateSimulationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        simCount={simulations?.length || 0}
      />
    </div>
  );
}
