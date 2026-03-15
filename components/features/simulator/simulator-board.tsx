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
  useReactFlow,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Sidebar } from "@/components/features/simulator/sidebar";
import { SystemNode } from "@/components/features/simulator/system-node";
import { Button } from "@/components/ui/button";
import { Save, Trash2, Settings2, ChevronLeft, Play, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { createSupabaseClient } from "@/lib/supabase";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useSimulationEngine } from "@/hooks/use-simulation-engine";
import { NodeConfig } from "@/components/features/simulator/node-config";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useTheme } from "next-themes";

import AnnotationNode from "@/components/features/simulator/annotation-node";
import GroupNode from "@/components/features/simulator/group-node";

const nodeTypes = {
  system: SystemNode,
  annotation: AnnotationNode,
  group: GroupNode,
};

const getId = () => `node_${Math.random().toString(36).substr(2, 9)}`;

export function SimulatorBoard({ initialData }: { initialData: any }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [activeSettingsNodeId, setActiveSettingsNodeId] = useState<
    string | null
  >(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialData.nodes || [],
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialData.edges || [],
  );

  const [isRunning, setIsRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { getToken } = useAuth();

  const onOpenSettings = useCallback((nodeId: string) => {
    setActiveSettingsNodeId(nodeId);
  }, []);

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      );
      toast.error("Component removed from system");
    },
    [setNodes, setEdges],
  );

  // Inject callbacks into nodes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          onOpenSettings,
          onDelete: deleteNode,
        },
      })),
    );
  }, [onOpenSettings, deleteNode, setNodes]);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowBackConfirm(true);
    } else {
      router.push("/dashboard");
    }
  };

  // Track changes to persistent data only
  const lastSavedData = useRef(
    JSON.stringify({ nodes: initialData.nodes, edges: initialData.edges }),
  );

  useEffect(() => {
    const currentData = JSON.stringify({
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: { ...n.data, isRunning: false },
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      })),
    });

    if (currentData !== lastSavedData.current) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [nodes, edges]);

  // Integrated Simulation Engine
  useSimulationEngine(nodes, edges, isRunning, setNodes);

  const onNodeConfigUpdate = useCallback(
    (nodeId: string, config: any) => {
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
        }),
      );
    },
    [setNodes],
  );

  const activeSettingsNode = nodes.find((n) => n.id === activeSettingsNodeId);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: isRunning }, eds)),
    [isRunning, setEdges],
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

      const nodeType = type === "annotation" ? "annotation" : type === "group" ? "group" : "system";

      const newNode = {
        id: getId(),
        type: nodeType,
        position,
        data: {
          label: `${type.replace("_", " ")}`.toUpperCase(),
          type: type,
          isRunning: false,
          onOpenSettings: (id: string) => onOpenSettings(id),
          onDelete: (id: string) => deleteNode(id),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, deleteNode, setNodes, onOpenSettings],
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
        nodes: nodes.map((n) => ({
          id: n.id,
          type: n.type,
          position: n.position,
          data: { ...n.data, isRunning: false },
        })),
        edges: edges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
        })),
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
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        animated: newState,
        style: { stroke: newState ? "#00FF00" : undefined },
      })),
    );
    setNodes((nds) =>
      nds.map((n) => ({ ...n, data: { ...n.data, isRunning: newState } })),
    );

    if (newState) {
      toast.success("Simulation started! Data is flowing...");
    } else {
      toast.info("Simulation stopped.");
    }
  };
  const handleAddInSimulator = useCallback((type: string, label: string) => {
    const position = { x: 100, y: 100 };
    const newNode = {
      id: getId(),
      type: type === 'annotation' ? 'annotation' : type === 'group' ? 'group' : 'system',
      position,
      data: { label, type },
    };
    setNodes((nds) => nds.concat(newNode));
    toast.success(`Added ${label}`);
  }, [setNodes]);

  if (!mounted) return null;

  return (
    <div className="flex h-full w-full bg-background overflow-hidden border rounded-xl shadow-2xl">
      <div className="hidden md:block">
        <Sidebar className="w-80" onAdd={handleAddInSimulator} />
      </div>
      <div 
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          mounted && resolvedTheme === 'dark' ? 'bg-black/20' : 'bg-muted/5'
        )} 
        ref={reactFlowWrapper}
      >
        {/* Top Toolbar */}
        <div className="h-auto md:h-20 border-b bg-background/80 backdrop-blur-md px-4 md:px-6 py-4 md:py-0 flex flex-col md:flex-row items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
             <Button
               variant="outline"
               size="sm"
               onClick={handleBack}
               className="gap-2 md:gap-3 h-9 md:h-11 px-3 md:px-6 bg-card/[0.05] hover:bg-accent border-border transition-all font-black text-[10px] md:text-sm uppercase tracking-widest rounded-lg md:rounded-xl shrink-0"
             >
               <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-primary" /> 
               <span className="text-foreground">Exit</span>
             </Button>
             
             {/* Mobile Sidebar Trigger */}
             <Sheet>
               <SheetTrigger asChild>
                 <Button variant="outline" size="sm" className="md:hidden gap-2 h-9 px-3 font-black uppercase tracking-widest text-[10px] rounded-lg bg-primary/10 border-primary/20 text-primary">
                    <Plus className="w-4 h-4" /> Components
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="p-0 sm:max-w-xs">
                 <SheetHeader className="sr-only">
                    <SheetTitle>Components Sidebar</SheetTitle>
                 </SheetHeader>
                 <Sidebar 
                    className="w-full border-none shadow-none" 
                    onAdd={handleAddInSimulator}
                 />
               </SheetContent>
             </Sheet>

             <div className="h-9 md:h-11 px-3 md:px-6 bg-card border border-border rounded-lg md:rounded-xl shadow-sm flex items-center gap-2 md:gap-4 shrink-0">
               <div className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full bg-primary animate-pulse" />
               <div className="flex flex-col justify-center">
                 <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] text-primary leading-none mb-0.5 md:mb-1">Active Design</span>
                 <span className="text-xs md:text-sm font-black text-foreground tracking-tight leading-none uppercase truncate max-w-[100px] md:max-w-none">{initialData.name}</span>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="gap-2 md:gap-3 h-9 md:h-11 px-3 md:px-4 font-black uppercase tracking-widest border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-lg md:rounded-xl text-[10px] md:text-sm flex-grow md:flex-grow-0"
            >
              <Save className="w-4 h-4 md:w-5 md:h-5" />
              {saving ? "..." : "Save"}
            </Button>
            <Button
              variant={isRunning ? "destructive" : "default"}
              size="sm"
              onClick={toggleSimulation}
              className="gap-2 md:gap-3 h-9 md:h-11 px-4 md:px-8 font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300 rounded-lg md:rounded-xl text-[10px] md:text-sm flex-grow md:flex-grow-0"
            >
              {isRunning ? (
                <>
                  <Trash2 className="w-4 h-4 md:w-5 md:h-5 fill-current" /> Stop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" /> Start
                </>
              )}
            </Button>
          </div>
        </div>

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
          colorMode={mounted && (resolvedTheme === 'dark' || resolvedTheme === 'light') ? resolvedTheme : 'light'}
          className="flex-grow"
        >
          <Background 
            color={mounted && resolvedTheme === 'dark' ? '#333' : '#ccc'} 
            variant={"dots" as any} 
            gap={20} 
          />
          <Controls />
          <MiniMap 
            zoomable 
            pannable 
            nodeStrokeColor={(n) => {
              if (n.type === 'annotation') return '#eab308';
              if (n.type === 'group') return '#94a3b8';
              return '#10b981';
            }}
            nodeColor={(n) => {
              if (n.type === 'annotation') return '#fef9c3';
              if (n.type === 'group') return '#f1f5f9';
              return '#ecfdf5';
            }}
            className="dark:bg-[#111] border border-border rounded-xl"
          />
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
              You might have unsaved changes in your system design. Would you
              like to save before returning to the dashboard?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-4">
            <AlertDialogCancel asChild>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => router.push("/dashboard")}
              >
                Discard and Exit
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={async () => {
                  await handleSave();
                  router.push("/dashboard");
                }}
              >
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
              onClick={() => {
                if (activeSettingsNode) {
                  deleteNode(activeSettingsNode.id);
                  setActiveSettingsNodeId(null);
                }
              }}
            >
              <Trash2 className="w-4 h-4" /> Delete Component
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function SimulatorContainer({
  initialData,
}: {
  initialData: { nodes: any[]; edges: any[]; name: string };
}) {
  return (
    <ReactFlowProvider>
      <SimulatorBoard initialData={initialData} />
    </ReactFlowProvider>
  );
}
