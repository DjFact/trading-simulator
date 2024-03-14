import { Injectable } from '@nestjs/common';
import { DiskHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class StorageHealthCheckService {
  constructor(private diskHealth: DiskHealthIndicator) {}

  storageCheck(
    diskHealthConfig: { [key: string]: number },
    storagePath?: string,
  ) {
    const checks = [];

    if (storagePath) {
      checks.push(
        () =>
          this.diskHealth.checkStorage(
            'disk health percentage: ' + storagePath,
            {
              thresholdPercent: diskHealthConfig.percentThreshold,
              path: storagePath,
            },
          ),
        () =>
          this.diskHealth.checkStorage(
            'disk health absolute size: ' + storagePath,
            {
              threshold: diskHealthConfig.thresholdGB * 1024 * 1024 * 1024,
              path: storagePath,
            },
          ),
      );
    }

    return checks;
  }
}
