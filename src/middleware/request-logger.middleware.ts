import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../services/logger.service';
import { MonitoringService } from '../services/monitoring.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: LoggerService,
    private readonly monitoringService: MonitoringService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || 'Unknown';

    // Ensure method and ip are strings
    const requestMethod = method || 'UNKNOWN';
    const clientIp = ip || 'unknown';

    // Log incoming request with colors
    this.logger.logHttpRequest(
      requestMethod,
      originalUrl,
      clientIp,
      'RequestLogger',
    );

    // Use response finish event instead of overriding end method
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const { statusCode } = res;
      const success = statusCode >= 200 && statusCode < 400;

      // Log response with colors
      this.logger.logHttpResponse(
        requestMethod,
        originalUrl,
        statusCode,
        responseTime,
        clientIp,
        'RequestLogger',
      );

      // Record metrics
      this.monitoringService.recordRequest(success, responseTime);
    });

    next();
  }
}
