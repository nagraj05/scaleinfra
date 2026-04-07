"use client";

import React, { memo, useState } from "react";
import { NodeProps, useReactFlow } from "@xyflow/react";
import { Settings2, Trash2 } from "lucide-react";

const GroupNode = ({ id, data, selected }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState((data.label as string) || "");
  const { setNodes } = useReactFlow();

  const handleBlur = () => {
    setIsEditing(false);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label,
            },
          };
        }
        return node;
      })
    );
  };

  return (
    <div 
      className={`w-full h-full min-w-[300px] min-h-[300px] rounded-3xl border-2 border-dashed transition-all group/node ${selected ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-muted-foreground/30 bg-muted/5 hover:border-muted-foreground/50'}`}
      onDoubleClick={() => setIsEditing(true)}
    >
      <div className="absolute -top-3 -right-2 flex gap-1 opacity-0 group-hover/node:opacity-100 transition-opacity z-10">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            (data as any).onOpenSettings?.(id);
          }}
          className="p-1.5 bg-background border rounded-full shadow-sm hover:border-primary hover:text-primary transition-all active:scale-95"
          title="Settings"
        >
          <Settings2 size={13} />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            (data as any).onDelete?.(id);
          }}
          className="p-1.5 bg-background border rounded-full shadow-sm hover:border-destructive hover:text-destructive transition-all active:scale-95"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div className="absolute -top-3 left-6 px-3 py-1 bg-background border rounded-full shadow-sm">
        {isEditing ? (
          <input
            autoFocus
            className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-transparent border-none outline-none w-[150px]"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
          />
        ) : (
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            {label || "CLUSTER GROUP"}
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(GroupNode);
