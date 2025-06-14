import { Controller, Get } from '@nestjs/common';
import { HealthCheckService,  HealthCheck,  TypeOrmHealthIndicator, MemoryHealthIndicator, DiskHealthIndicator, HttpHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private http: HttpHealthIndicator,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Comprobación del estado de la aplicación, incluidos la base de datos, la memoria, el disco y los servicios externos' })
  @ApiResponse({ status: 200, description: 'Application is healthy' })
  @ApiResponse({ status: 503, description: 'Application is unhealthy' })
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.disk.checkStorage('disk', { thresholdPercent: 0.7, path: '/' }),
    //   () => this.http.pingCheck('redis', 'http://redis:6379'),
    ]);
  }
}
