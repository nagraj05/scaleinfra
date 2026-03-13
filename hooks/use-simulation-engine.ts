import { useCallback, useEffect, useRef } from "react";

export function useSimulationEngine(
  nodes: any[],
  edges: any[],
  isRunning: boolean,
  setNodes: (nds: any) => void
) {
  const lastUpdateRef = useRef<number>(Date.now());

  const tick = useCallback(() => {
    if (!isRunning) return;

    // 1. Initialize metrics for the current tick
    const nodeMetrics: Record<string, { rpm: number; latency: number; errorRate: number }> = {};
    nodes.forEach(node => {
      nodeMetrics[node.id] = { rpm: 0, latency: node.data.config?.latency || 50, errorRate: 0 };
    });

    // 2. Calculate input RPM for each node
    // Simple propagation: start with clients, move downstream
    // For a real simulation, we'd do a BFS/DFS or just solve the flow
    
    // Clients are sources
    nodes.filter(n => n.data.type === 'client').forEach(client => {
      nodeMetrics[client.id].rpm = client.data.config?.load || 100;
    });

    // Propagate through edges
    // Note: This is a simplified 1-pass propagation. For complex graphs (loops), we'd need more logic.
    const sortedNodes = [...nodes]; // Assume topologically sorted for simplicity or just run multiple passes
    
    // Multiple passes to handle multi-step flows
    for (let i = 0; i < 3; i++) {
      edges.forEach(edge => {
        const source = edge.source;
        const target = edge.target;
        
        if (nodeMetrics[source] && nodeMetrics[target]) {
           const sourceMetrics = nodeMetrics[source];
           const sourceConfig = nodes.find(n => n.id === source)?.data.config || {};
           const targetNode = nodes.find(n => n.id === target);
           
           // Load balancer logic: split load among outgoing edges
           const outgoingEdges = edges.filter(e => e.source === source);
           const share = 1 / outgoingEdges.length;
           
           const incomingRpm = sourceMetrics.rpm * share;
           
           // Apply source's successful requests (ignore errors for now or propagate them)
           nodeMetrics[target].rpm += incomingRpm;
        }
      });
    }

    // 3. Apply constraints (Capacity) and calculate final metrics
    const updatedNodes = nodes.map(node => {
      const metrics = nodeMetrics[node.id];
      const config = node.data.config || { capacity: 1000, latency: 50 };
      
      let finalRpm = metrics.rpm;
      let baseLatency = config.latency || 50;
      let errorRate = (node.data.config?.errorRate / 100) || 0;
      
      // Dynamic Latency & Error Rate based on load
      // As RPM approaches capacity, latency increases (Queuing Delay)
      const loadFactor = finalRpm / config.capacity;
      
      let effectiveLatency = baseLatency;
      if (loadFactor > 0.8) {
        // Exponential latency growth near capacity
        effectiveLatency = Math.round(baseLatency * (1 + Math.pow(loadFactor - 0.8, 2) * 10));
      }

      if (loadFactor > 1) {
        // High error rate beyond capacity
        errorRate += (finalRpm - config.capacity) / finalRpm;
      }

      return {
        ...node,
        data: {
          ...node.data,
          metrics: {
            rpm: finalRpm,
            latency: Math.min(effectiveLatency, 5000), // Cap at 5s
            errorRate: Math.min(errorRate, 1)
          }
        }
      };
    });

    setNodes(updatedNodes);
  }, [nodes, edges, isRunning, setNodes]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      tick();
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [isRunning, tick]);
}
