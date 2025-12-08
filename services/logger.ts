export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  error?: Error;
  context?: Record<string, any>;
  timestamp: number;
}

class Logger {
  private telegramBotToken?: string;
  private telegramChatId?: string;
  private enabled: boolean = false;

  constructor() {
    this.telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    this.telegramChatId = process.env.TELEGRAM_CHAT_ID;
    this.enabled = process.env.TELEGRAM_LOGGING_ENABLED === 'true' && !!this.telegramBotToken && !!this.telegramChatId;
    
    if (this.enabled) {
      console.log('[Logger] Telegram logging enabled');
    } else {
      console.log('[Logger] Telegram logging disabled (check TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, TELEGRAM_LOGGING_ENABLED)');
    }
  }

  private formatMessage(entry: LogEntry): string {
    const emoji = entry.level === LogLevel.ERROR ? '🔥' : entry.level === LogLevel.WARN ? '⚠️' : 'ℹ️';
    const levelLabel = entry.level.toUpperCase();
    const time = new Date(entry.timestamp).toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    
    let message = `${emoji} [${levelLabel}] Beliarg Server\n`;
    message += `⏰ Time: ${time}\n`;
    message += `📝 Message: ${entry.message}\n`;
    
    if (entry.error) {
      message += `❌ Error: ${entry.error.message}\n`;
      if (entry.error.stack) {
        // Limit stack trace length
        const stack = entry.error.stack.split('\n').slice(0, 5).join('\n');
        message += `📍 Stack:\n\`\`\`\n${stack}\n\`\`\`\n`;
      }
    }
    
    if (entry.context) {
      Object.entries(entry.context).forEach(([key, value]) => {
        // Mask sensitive data
        let displayValue = value;
        if (typeof value === 'string' && (key.toLowerCase().includes('token') || key.toLowerCase().includes('password') || key.toLowerCase().includes('secret'))) {
          displayValue = '***';
        } else if (typeof value === 'object') {
          displayValue = JSON.stringify(value).substring(0, 200);
        }
        message += `📍 ${key}: ${displayValue}\n`;
      });
    }
    
    return message;
  }

  private async sendToTelegram(entry: LogEntry): Promise<void> {
    if (!this.enabled || !this.telegramBotToken || !this.telegramChatId) {
      return;
    }

    // Send only ERROR and WARN, INFO is too verbose
    if (entry.level === LogLevel.INFO) {
      return;
    }

    try {
      const message = this.formatMessage(entry);
      const url = `https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.telegramChatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Logger] Failed to send message to Telegram:', response.status, errorText);
      }
    } catch (err) {
      // Don't block execution on send error
      console.error('[Logger] Error sending to Telegram:', err);
    }
  }

  private log(level: LogLevel, message: string, error?: Error, context?: Record<string, any>): void {
    const entry: LogEntry = {
      level,
      message,
      error,
      context,
      timestamp: Date.now(),
    };

    // Always log to console
    if (level === LogLevel.ERROR) {
      console.error(`[${level.toUpperCase()}]`, message, error || '', context || '');
    } else if (level === LogLevel.WARN) {
      console.warn(`[${level.toUpperCase()}]`, message, context || '');
    } else {
      console.log(`[${level.toUpperCase()}]`, message, context || '');
    }

    // Send to Telegram asynchronously (non-blocking)
    this.sendToTelegram(entry).catch(err => {
      console.error('[Logger] Failed to send to Telegram:', err);
    });
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, undefined, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, undefined, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, error, context);
  }
}

// Singleton instance
export const logger = new Logger();



