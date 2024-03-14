import { ServiceUnavailableException } from '@nestjs/common';

export class HealthServiceUnavailableException extends ServiceUnavailableException {}
