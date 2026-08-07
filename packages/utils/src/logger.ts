declare const process: { env: { NODE_ENV: string } };

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isDevelopment = typeof process !== 'undefined' && process.env ? process.env.NODE_ENV !== 'production' : true;

  private formatMessage(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}]: ${message} ${
      context ? JSON.stringify(context) : ''
    }`;
  }

  info(message: string, context?: Record<string, unknown>) {
    console.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: Record<string, unknown>) {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    console.error(this.formatMessage('error', message, context), error);
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }
}

export const logger = new Logger();
