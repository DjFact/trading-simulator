import { bootstrap } from '../../base.main';
import { StopLossWorkerModule } from './stop-loss-worker.module';
import { MicroserviceEnum } from '../../../../common/enum/microservice.enum';

bootstrap(StopLossWorkerModule, MicroserviceEnum.StopLossWorker);
