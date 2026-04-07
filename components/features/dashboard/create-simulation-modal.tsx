"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Rocket, ShieldAlert } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  simCount: number;
}

export function CreateSimulationModal({ isOpen, onClose, simCount }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  const isLimitReached = simCount >= 3;

  const handleCreate = async () => {
    if (!name.trim()) return;
    if (isLimitReached) return;

    setLoading(true);
    try {
      const token = await getToken({ template: "supabase" });
      const supabase = createSupabaseClient(token || undefined);
      
      const { data, error } = await supabase
        .from("simulations")
        .insert({
          user_id: user?.id,
          name,
          description,
          nodes: [],
          edges: [],
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Simulation created successfully!");
      router.push(`/simulator/${data.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create simulation.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isLimitReached ? "Upgrade to Architect" : "Create New Simulation"}</DialogTitle>
          <DialogDescription>
            {isLimitReached 
              ? "You've reached the free tier limit of 3 simulations." 
              : "Define the core parameters of your new system architecture."}
          </DialogDescription>
        </DialogHeader>

        {isLimitReached ? (
          <div className="py-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Unlock unlimited simulations and advanced metrics by upgrading to the Architect plan.
            </p>
            <Button className="w-full gap-2" size="lg">
              Coming Soon <Rocket className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2 text-left">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g. Distributed E-commerce App"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2 text-left">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Briefly describe the purpose of this simulation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
              <Button onClick={handleCreate} disabled={loading || !name}>
                {loading ? "Creating..." : "Create Simulation"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
