import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@ApiTags('Saludo')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Devuelve el clasico \'Hello world\'' })
  getHello(): string {
    this.logger.info('Mensaje de log con requestId');
    return this.appService.getHello();
  }
}
