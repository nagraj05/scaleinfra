"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  Connection,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Panel,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Sidebar } from "@/components/features/simulator/sidebar";
import { SystemNode } from "@/components/features/simulator/system-node";
import { Button } from "@/components/ui/button";
import { Play, Save, Trash2, Settings2, ChevronLeft } from "lucide-react";
import { createSupabaseClient } from "@/lib/supabase";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useSimulationEngine } from "@/hooks/use-simulation-engine";
import { NodeConfig } from "@/components/features/simulator/node-config";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

const nodeTypes = {
  system: SystemNode,
};

const getId = () => `node_${Math.random().toString(36).substr(2, 9)}`;

export function SimulatorBoard({ initialData }: { initialData: any }) {
  const reactFlowWrapper = useRef(null);
  const [activeSettingsNodeId, setActiveSettingsNodeId] = useState<string | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState((initialData.nodes || []).map((n: any) => ({
    ...n,
    data: { ...n.data, onOpenSettings: (id: string) => setActiveSettingsNodeId(id) }
  })));
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.edges || []);
  const [isRunning, setIsRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { getToken } = useAuth();

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowBackConfirm(true);
    } else {
      router.push('/dashboard');
    }
  };

  // Track changes to persistent data only
  const lastSavedData = useRef(JSON.stringify({ nodes: initialData.nodes, edges: initialData.edges }));
  
  useEffect(() => {
    const currentData = JSON.stringify({ 
      nodes: nodes.map(n => ({ id: n.id, type: n.type, position: n.position, data: { ...n.data, isRunning: false } })), 
      edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target })) 
    });
    
    if (currentData !== lastSavedData.current) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [nodes, edges]);

  // Integrated Simulation Engine
  useSimulationEngine(nodes, edges, isRunning, setNodes);

  const onNodeConfigUpdate = useCallback((nodeId: string, config: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              config,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const onOpenSettings = useCallback((nodeId: string) => {
    setActiveSettingsNodeId(nodeId);
  }, []);

  const activeSettingsNode = nodes.find((n) => n.id === activeSettingsNodeId);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: isRunning }, eds)),
    [isRunning, setEdges]
  );

  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type: "system",
        position,
        data: { 
          label: `${type.replace('_', ' ')}`, 
          type: type, 
          isRunning: false,
          onOpenSettings 
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, onOpenSettings, setNodes]
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await getToken({ template: "supabase" });
      const supabase = createSupabaseClient(token || undefined);
      
      const { error } = await supabase
        .from("simulations")
        .update({
          nodes,
          edges,
        })
        .eq("id", params.id);

      if (error) throw error;
      
      // Update baseline to ignore changes made before this save
      lastSavedData.current = JSON.stringify({ 
        nodes: nodes.map(n => ({ id: n.id, type: n.type, position: n.position, data: { ...n.data, isRunning: false } })), 
        edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target })) 
      });
      
      setSaving(false);
      setHasUnsavedChanges(false);
      toast.success("Simulation saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save simulation.");
    } finally {
      setSaving(false);
    }
  };

  const toggleSimulation = () => {
    const newState = !isRunning;
    setIsRunning(newState);
    
    // Update all edges and nodes visual state
    setEdges((eds) => eds.map((e) => ({ ...e, animated: newState, style: { stroke: newState ? "#00FF00" : undefined } })));
    setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, isRunning: newState } })));
    
    if (newState) {
      toast.success("Simulation started! Data is flowing...");
    } else {
      toast.info("Simulation stopped.");
    }
  };

  const deleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
  }, [setNodes, setEdges]);

  return (
    <div className="flex h-full w-full bg-background overflow-hidden border rounded-xl shadow-2xl">
      <Sidebar />
      <div className="flex-grow h-full relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={() => {}}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          className="bg-muted/5"
        >
          <Background color="#ccc" variant={"dots" as any} gap={20} />
          <Controls />
          
          <Panel position="top-right" className="flex gap-4 p-4">
            <Button variant="outline" size="sm" onClick={deleteSelected} className="gap-2 bg-card">
              <Trash2 className="w-4 h-4 text-destructive" /> Delete
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving} 
              className="gap-3 h-12 px-8 font-black uppercase tracking-widest shadow-xl"
            >
              <Save className="w-5 h-5" /> 
              {saving ? "Saving..." : "Save Simulation"}
            </Button>
            <Button 
              variant={isRunning ? "destructive" : "secondary"} 
              onClick={toggleSimulation}
              className="gap-3 h-12 px-8 font-black uppercase tracking-widest shadow-xl"
            >
              {isRunning ? (
                <><Trash2 className="w-5 h-5" /> Stop</>
              ) : (
                <><Play className="w-5 h-5" /> Run</>
              )}
            </Button>
          </Panel>

          <Panel position="top-left" className="flex gap-4 p-4">
             <Button 
               variant="outline" 
               size="lg" 
               onClick={handleBack}
               className="gap-3 h-12 px-8 bg-card/[0.05] hover:bg-accent border-border transition-all font-black text-sm uppercase tracking-widest rounded-2xl"
             >
               <ChevronLeft className="w-5 h-5 text-primary" /> 
               <span className="text-foreground">Dashboard</span>
             </Button>
             <div className="px-8 py-3 bg-card border border-border rounded-2xl shadow-2xl flex items-center gap-4 backdrop-blur-xl">
               <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
               <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary leading-none mb-1">Active Design</span>
                 <span className="text-base font-black text-foreground tracking-tight leading-none uppercase">{initialData.name}</span>
               </div>
             </div>
          </Panel>
        </ReactFlow>
      </div>

      <AlertDialog open={showBackConfirm} onOpenChange={setShowBackConfirm}>
        <AlertDialogContent className="shadow-2xl border-primary/20 bg-background/95 backdrop-blur-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Save className="w-5 h-5 text-primary" />
              </div>
              Save changes?
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2 text-sm leading-relaxed">
              You might have unsaved changes in your system design. Would you like to save before returning to the dashboard?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-4">
            <AlertDialogCancel asChild>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => router.push('/dashboard')}>
                Discard and Exit
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={async () => {
                await handleSave();
                router.push('/dashboard');
              }}>
                Save and Exit
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet 
        open={!!activeSettingsNode} 
        onOpenChange={(open) => {
          if (!open) {
            setActiveSettingsNodeId(null);
          }
        }}
      >
        <SheetContent className="w-80 sm:w-96 border-l shadow-2xl">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" />
              Component Settings
            </SheetTitle>
          </SheetHeader>
          {activeSettingsNode && (
            <NodeConfig 
              node={activeSettingsNode} 
              onUpdate={onNodeConfigUpdate} 
            />
          )}
          <div className="mt-8 pt-6 border-t">
             <Button 
               variant="outline" 
               className="w-full gap-2 text-destructive hover:text-destructive"
               onClick={deleteSelected}
             >
               <Trash2 className="w-4 h-4" /> Delete Component
             </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function SimulatorContainer({ initialData }: { initialData: { nodes: any[], edges: any[], name: string } }) {
  return (
    <ReactFlowProvider>
      <SimulatorBoard initialData={initialData} />
    </ReactFlowProvider>
  );
}
