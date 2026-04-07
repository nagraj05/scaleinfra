"use client";

import React, { memo, useState, useEffect, useRef } from "react";
import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react";
import { Settings2, Trash2, Edit3, Check } from "lucide-react";

const AnnotationNode = ({ id, data, selected }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState((data.label as string) || "");
  const { setNodes } = useReactFlow();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

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
      className={`px-5 py-4 shadow-xl rounded-sm bg-yellow-100/90 dark:bg-yellow-900/40 border-l-8 border-yellow-400 dark:border-yellow-500 min-w-[280px] max-w-[400px] transition-all group/node ${selected ? 'ring-2 ring-primary ring-offset-4' : 'hover:shadow-2xl'}`}
      onDoubleClick={() => setIsEditing(true)}
    >
      <div className="absolute -top-4 -right-2 flex gap-1 opacity-0 group-hover/node:opacity-100 transition-opacity z-10">
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

      <div className="flex items-start gap-2">
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-600/60 dark:text-yellow-400/40 flex items-center gap-2">
              <Edit3 size={10} /> Annotation
            </div>
            {isEditing && (
              <button onClick={handleBlur} className="text-primary hover:text-primary/80 transition-colors">
                <Check size={14} />
              </button>
            )}
          </div>
          
          {isEditing ? (
            <textarea
              ref={textareaRef}
              className="w-full bg-transparent border-none outline-none text-sm font-medium text-yellow-950 dark:text-yellow-50 resize-none min-h-[80px] leading-relaxed"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleBlur}
              placeholder="Start typing your note..."
            />
          ) : (
            <div className="text-sm font-medium text-yellow-950 dark:text-yellow-50 whitespace-pre-wrap leading-relaxed min-h-[40px]">
              {label || "Double-click to edit note..."}
            </div>
          )}
        </div>
      </div>
      
      <Handle type="target" position={Position.Top} className="opacity-0 w-0 h-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0 w-0 h-0" />
    </div>
  );
};

export default memo(AnnotationNode);
