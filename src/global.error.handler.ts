import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const logger = new Logger('my-logger');
    
    // Log the exception
    // Logger.error(`Error: ${exception.message}`, exception.stack, 'ExceptionFilter');
    // Logger.error(`Error: ${exception.message}`);
    // Logger.error( `Stack Trace: ${exception.stack}`)

    // Create the logs directory if it doesn't exist
    const logsDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir); 
    }

    const fileStream = fs.createWriteStream(path.join(logsDir, 'exceptions.log'), { flags: 'a' });
    fileStream.write(`[${new Date().toISOString()}] Error: ${exception.message}\n`);
    // fileStream.write(`[${new Date().toISOString()}] Stack Trace: ${exception.stack}\n`);
    fileStream.end();

    // console.log(exception);
    // console.log(exception.status);

    return response.send({
      statusCode: exception.status,
      message: exception.response.message || exception.response, // with try and catch
      // message: exception.response, // without try and catch
      timestamp: new Date().toISOString(),
      error: exception.response.error,
      path: request.url,
    });
  }
}
