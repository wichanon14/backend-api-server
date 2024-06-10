// types/pino-pretty.d.ts
declare module 'pino-pretty' {
    interface PrettyOptions {
      colorize?: boolean;
      crlf?: boolean;
      errorLikeObjectKeys?: string[];
      errorProps?: string;
      levelFirst?: boolean;
      messageKey?: string;
      translateTime?: boolean | string;
      singleLine?: boolean;
      // Add other options as needed
    }
  
    export default function pretty(options?: PrettyOptions): NodeJS.ReadWriteStream;
  }
  