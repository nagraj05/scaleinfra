import { useCallback, useEffect, useRef } from "react";
import { 
  calculatePoisson, 
  calculateUtilization, 
  calculateMMcLatency, 
  calculateCacheTraffic 
} from "@/lib/math-utils";

export function useSimulationEngine(
  nodes: any[],
  edges: any[],
  isRunning: boolean,
  setNodes: (nds: any) => void
) {
  const queuesRef = useRef<Record<string, number>>({});

  const tick = useCallback(() => {
    if (!isRunning) return;

    // 1. Initialize metrics and aggregate incoming traffic
    const nodeMetrics: Record<string, { incomingLambda: number; lambda: number; mu: number; instances: number; cacheHitRate: number }> = {};
    
    nodes.forEach(node => {
      const config = node.data.config || {};
      nodeMetrics[node.id] = { 
        incomingLambda: 0, 
        lambda: 0,
        mu: config.capacity || 1000, 
        instances: config.instances || 1,
        cacheHitRate: (config.cacheHitRate || 0) / 100
      };
      
      // Initialize queues if not present
      if (queuesRef.current[node.id] === undefined) {
        queuesRef.current[node.id] = 0;
      }
    });

    // 2. Identify traffic sources (Clients)
    nodes.filter(n => n.data.type === 'client').forEach(client => {
      const load = client.data.config?.load || 100;
      // Clients generate Poisson traffic
      nodeMetrics[client.id].incomingLambda = calculatePoisson(load, 1);
    });

    // 3. Traffic Propagation (Multiple passes to handle flow)
    // In a discrete simulation, we take what was "processed" last tick and move it forward?
    // For this MVP, we'll do simultaneous flow calculation
    
    // Sort nodes to process upstream first if possible (simplified BFS approach)
    // For now, 3 passes as before to handle depth
    for (let pass = 0; pass < 3; pass++) {
      edges.forEach(edge => {
        const source = edge.source;
        const target = edge.target;
        
        if (nodeMetrics[source] && nodeMetrics[target]) {
          const sourceNode = nodes.find(n => n.id === source);
          const outgoingEdges = edges.filter(e => e.source === source);
          const splitFactor = 1 / outgoingEdges.length;
          
          let trafficToForward = nodeMetrics[source].incomingLambda;
          
          // If source is a cache, reduce traffic to database
          if (sourceNode?.data.type === 'cache' || sourceNode?.data.type === 'redis') {
            trafficToForward = calculateCacheTraffic(trafficToForward, nodeMetrics[source].cacheHitRate);
          }
          
          nodeMetrics[target].incomingLambda += trafficToForward * splitFactor;
        }
      });
    }

    // 4. Update Node State with Mathematical Models
    const updatedNodes = nodes.map(node => {
      const metrics = nodeMetrics[node.id];
      const lambda = metrics.incomingLambda;
      const mu = metrics.mu;
      const c = metrics.instances;
      
      const utilization = calculateUtilization(lambda, mu, c);
      
      // Calculate Real-time Latency (M/M/c model)
      // Latency is in seconds, convert to ms
      const latency = calculateMMcLatency(lambda, mu, c) * 1000;
      
      // Queue update (Discrete time logic)
      // processed = min(queue + new_requests, capacity)
      const capacity = mu * c;
      const arrivals = lambda;
      const currentQueue = queuesRef.current[node.id] || 0;
      const processed = Math.min(currentQueue + arrivals, capacity);
      const newQueue = (currentQueue + arrivals) - processed;
      queuesRef.current[node.id] = newQueue;

      // Error Rate increases beyond capacity (Maths.md 13)
      let errorRate = (node.data.config?.errorRate / 100) || 0;
      if (utilization > 1) {
        errorRate += (lambda - capacity) / lambda;
      }

      return {
        ...node,
        data: {
          ...node.data,
          metrics: {
            rpm: lambda,
            latency: Math.min(Math.round(latency), 10000), // Cap at 10s
            errorRate: Math.min(errorRate, 1),
            utilization: utilization,
            queueLength: newQueue
          }
        }
      };
    });

    setNodes(updatedNodes);
  }, [nodes, edges, isRunning, setNodes]);

  useEffect(() => {
    if (!isRunning) {
      // Reset queues when stopped
      queuesRef.current = {};
      return;
    }

    const interval = setInterval(() => {
      tick();
    }, 1000); 

    return () => clearInterval(interval);
  }, [isRunning, tick]);
}
