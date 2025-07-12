import { Injectable } from '@nestjs/common';

export interface Metrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: NodeJS.CpuUsage;
}

@Injectable()
export class MonitoringService {
  private metrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    responseTimes: [] as number[],
    startTime: Date.now(),
  };

  recordRequest(success: boolean, responseTime: number) {
    this.metrics.totalRequests++;
    this.metrics.responseTimes.push(responseTime);

    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }

    // Keep only last 1000 response times for average calculation
    if (this.metrics.responseTimes.length > 1000) {
      this.metrics.responseTimes.shift();
    }
  }

  getMetrics(): Metrics {
    const averageResponseTime =
      this.metrics.responseTimes.length > 0
        ? this.metrics.responseTimes.reduce((a, b) => a + b, 0) /
          this.metrics.responseTimes.length
        : 0;

    return {
      totalRequests: this.metrics.totalRequests,
      successfulRequests: this.metrics.successfulRequests,
      failedRequests: this.metrics.failedRequests,
      averageResponseTime,
      uptime: Date.now() - this.metrics.startTime,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
    };
  }

  getHealthStatus() {
    const uptime = Date.now() - this.metrics.startTime;
    const memoryUsage = process.memoryUsage();
    const memoryUsagePercent =
      (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: {
        value: uptime,
        formatted: this.formatUptime(uptime),
      },
      memory: {
        used: memoryUsage.heapUsed,
        total: memoryUsage.heapTotal,
        percentage: Math.round(memoryUsagePercent * 100) / 100,
      },
      requests: {
        total: this.metrics.totalRequests,
        successRate:
          this.metrics.totalRequests > 0
            ? Math.round(
                (this.metrics.successfulRequests / this.metrics.totalRequests) *
                  10000,
              ) / 100
            : 100,
      },
    };
  }

  private formatUptime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}
