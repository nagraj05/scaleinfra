import { expect, test, describe } from "bun:test";
import { 
  calculatePoisson, 
  calculateUtilization, 
  calculateQueueLength, 
  calculateMMcLatency,
  calculateCacheTraffic
} from "./math-utils";

describe("Math Utilities", () => {
  test("calculateUtilization", () => {
    expect(calculateUtilization(100, 200, 1)).toBe(0.5);
    expect(calculateUtilization(100, 20, 5)).toBe(1);
    expect(calculateUtilization(100, 0, 1)).toBe(1);
  });

  test("calculateMMcLatency (M/M/1 case)", () => {
    // lambda=10, mu=20, c=1 -> W = 1 / (20-10) = 0.1
    const latency = calculateMMcLatency(10, 20, 1);
    expect(latency).toBeCloseTo(0.1);
  });

  test("calculateQueueLength (M/M/1 case)", () => {
    // lambda=10, mu=20, c=1 -> Lq = rho^2 / (1-rho) = 0.5^2 / 0.5 = 0.5
    const lq = calculateQueueLength(10, 20, 1);
    expect(lq).toBeCloseTo(0.5);
  });

  test("calculateMMcLatency (M/M/2 case)", () => {
    // lambda=10, mu=10, c=2
    // r = 1, rho = 0.5
    // P0 = 1 / (1 + 1 + (1^2 / (2!(1-0.5)))) = 1 / (2 + 1) = 1/3
    // Lq = (P0 * r^c * rho) / (c! * (1-rho)^2) = (1/3 * 1 * 0.5) / (2 * 0.25) = (1/6) / 0.5 = 1/3
    // Wq = Lq/lambda = (1/3) / 10 = 1/30
    // W = Wq + 1/mu = 1/30 + 1/10 = 4/30 = 2/15 approx 0.1333
    const latency = calculateMMcLatency(10, 10, 2);
    expect(latency).toBeCloseTo(0.1333, 4);
  });

  test("calculateCacheTraffic", () => {
    expect(calculateCacheTraffic(100, 0.8)).toBeCloseTo(20);
    expect(calculateCacheTraffic(100, 0)).toBe(100);
    expect(calculateCacheTraffic(100, 1)).toBe(0);
  });

  test("calculatePoisson", () => {
    // Statistical test: average over many samples should be approx lambda
    const lambda = 10;
    let sum = 0;
    const samples = 1000;
    for (let i = 0; i < samples; i++) {
      sum += calculatePoisson(lambda);
    }
    const avg = sum / samples;
    expect(avg).toBeGreaterThan(8);
    expect(avg).toBeLessThan(12);
  });
});
