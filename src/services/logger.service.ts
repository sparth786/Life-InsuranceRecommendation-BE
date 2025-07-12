import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      defaultMeta: { service: 'life-insurance-api' },
      transports: [
        // Console transport with custom colors
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.colorize({ all: true }),
            winston.format.printf(
              ({
                timestamp,
                level,
                message,
                context,
                method,
                statusCode,
                responseTime,
                ip,
              }) => {
                // Color codes
                const colors = {
                  reset: '\x1b[0m',
                  bright: '\x1b[1m',
                  red: '\x1b[31m',
                  green: '\x1b[32m',
                  yellow: '\x1b[33m',
                  blue: '\x1b[34m',
                  magenta: '\x1b[35m',
                  cyan: '\x1b[36m',
                  white: '\x1b[37m',
                  gray: '\x1b[90m',
                };

                // Method colors
                const methodColors = {
                  GET: colors.green,
                  POST: colors.blue,
                  PUT: colors.yellow,
                  DELETE: colors.red,
                  PATCH: colors.magenta,
                  OPTIONS: colors.cyan,
                  HEAD: colors.gray,
                };

                // Status code colors
                const getStatusColor = (status: number) => {
                  if (status >= 200 && status < 300) return colors.green;
                  if (status >= 300 && status < 400) return colors.blue;
                  if (status >= 400 && status < 500) return colors.yellow;
                  if (status >= 500) return colors.red;
                  return colors.white;
                };

                let formattedMessage = `${colors.gray}[${timestamp}]${colors.reset} `;

                // Add method color if present
                if (method && typeof method === 'string') {
                  const methodColor =
                    methodColors[method as keyof typeof methodColors] ||
                    colors.white;
                  formattedMessage += `${methodColor}${method}${colors.reset} `;
                }

                // Add status code color if present
                if (statusCode && typeof statusCode === 'number') {
                  const statusColor = getStatusColor(statusCode);
                  formattedMessage += `${statusColor}${statusCode}${colors.reset} `;
                }

                // Add response time if present
                if (responseTime) {
                  formattedMessage += `${colors.cyan}${responseTime}ms${colors.reset} `;
                }

                // Add IP if present
                if (ip) {
                  formattedMessage += `${colors.magenta}${ip}${colors.reset} `;
                }

                // Add level and context
                formattedMessage += `${colors.bright}${level}${colors.reset} `;
                if (context) {
                  formattedMessage += `${colors.yellow}[${context}]${colors.reset} `;
                }

                // Add the actual message
                formattedMessage += message;

                return formattedMessage;
              },
            ),
          ),
        }),
        // File transport for all logs (JSON format for parsing)
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
        // Error file transport
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error',
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // Custom method for HTTP requests with colors
  logHttpRequest(method: string, url: string, ip: string, context?: string) {
    this.logger.info(`Request to ${url}`, {
      context: context || 'HTTP',
      method,
      ip,
    });
  }

  // Custom method for HTTP responses with colors
  logHttpResponse(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    ip: string,
    context?: string,
  ) {
    this.logger.info(`Response from ${url}`, {
      context: context || 'HTTP',
      method,
      statusCode,
      responseTime,
      ip,
    });
  }
}
