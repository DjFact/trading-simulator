import { bootstrap } from '../../base.main';
import { LimitWorkerModule } from './limit-worker.module';
import { MicroserviceEnum } from '../../../../common/enum/microservice.enum';

bootstrap(LimitWorkerModule, MicroserviceEnum.LimitWorker);
