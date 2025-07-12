import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MonitoringService } from '../services/monitoring.service';
import { LoggerService } from '../services/logger.service';

@ApiTags('monitoring')
@Controller('monitoring')
export class MonitoringController {
  constructor(
    private readonly monitoringService: MonitoringService,
    private readonly logger: LoggerService,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Application is healthy' })
  @ApiResponse({ status: 503, description: 'Application is unhealthy' })
  getHealth() {
    const health = this.monitoringService.getHealthStatus();
    this.logger.log(
      `Health check requested - Status: ${health.status}`,
      'MonitoringController',
    );
    return health;
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get application metrics' })
  @ApiResponse({ status: 200, description: 'Application metrics' })
  getMetrics() {
    const metrics = this.monitoringService.getMetrics();
    this.logger.log('Metrics requested', 'MonitoringController');
    return metrics;
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Application is ready to serve requests',
  })
  @ApiResponse({ status: 503, description: 'Application is not ready' })
  getReadiness() {
    const health = this.monitoringService.getHealthStatus();
    const isReady =
      health.status === 'healthy' && health.memory.percentage < 90;

    this.logger.log(
      `Readiness check - Ready: ${isReady}`,
      'MonitoringController',
    );

    if (isReady) {
      return { status: 'ready', timestamp: new Date().toISOString() };
    } else {
      return { status: 'not ready', timestamp: new Date().toISOString() };
    }
  }
}
