/**
 * Mathematical utilities for system architecture simulation
 * Based on maths.md specification
 */

/**
 * 14. Traffic Model (Poisson)
 * Generates a random number of arrivals in a given time step following a Poisson distribution.
 * P(k) = (lambda^k * e^-lambda) / k!
 * Using Knuth's algorithm for Poisson samples
 */
export function calculatePoisson(lambda: number, dt: number = 1): number {
  const L = Math.exp(-(lambda * dt));
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

/**
 * 4. Utilization
 * rho = lambda / (c * mu)
 */
export function calculateUtilization(lambda: number, mu: number, c: number = 1): number {
  if (mu <= 0 || c <= 0) return 1;
  return lambda / (c * mu);
}

/**
 * 6. Multi Server Queue (M/M/c) - Probability system is empty
 */
function calculateP0(lambda: number, mu: number, c: number): number {
  const rho = calculateUtilization(lambda, mu, c);
  const r = lambda / mu;
  
  let sum = 0;
  for (let n = 0; n < c; n++) {
    sum += Math.pow(r, n) / factorial(n);
  }
  
  const lastTerm = (Math.pow(r, c) / (factorial(c) * (1 - rho)));
  return 1 / (sum + lastTerm);
}

/**
 * 6. Multi Server Queue (M/M/c) - Queue length
 * Lq = (P0 * (lambda/mu)^c * rho) / (c! * (1-rho)^2)
 */
export function calculateQueueLength(lambda: number, mu: number, c: number): number {
  const rho = calculateUtilization(lambda, mu, c);
  if (rho >= 1) return Infinity; // System is overloaded
  
  const r = lambda / mu;
  const p0 = calculateP0(lambda, mu, c);
  
  return (p0 * Math.pow(r, c) * rho) / (factorial(c) * Math.pow(1 - rho, 2));
}

/**
 * 6. Multi Server Queue (M/M/c) - Response time (Latency)
 * W = Wq + 1/mu
 * Wq = Lq / lambda
 */
export function calculateMMcLatency(lambda: number, mu: number, c: number): number {
  if (lambda <= 0) return 1 / mu;
  
  const rho = calculateUtilization(lambda, mu, c);
  if (rho >= 1) {
    // Overloaded: latency grows over time. 
    // For a static snapshot, we can return a "very high" value or use a growth model.
    // Based on maths.md 15: latency = base_latency + queue / mu
    return (1 / mu) * 10; // Simple heuristic for overload in static context
  }
  
  const lq = calculateQueueLength(lambda, mu, c);
  const wq = lq / lambda;
  
  return wq + (1 / mu);
}

/**
 * 8. Cache Model
 * Traffic reaching database: lambda_db = lambda * (1 - h)
 */
export function calculateCacheTraffic(lambda: number, hitRate: number): number {
  return lambda * (1 - hitRate);
}

/**
 * Helper: Factorial
 */
function factorial(n: number): number {
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}
