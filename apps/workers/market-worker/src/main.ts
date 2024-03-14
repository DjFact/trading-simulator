import { bootstrap } from '../../base.main';
import { MarketWorkerModule } from './market-worker.module';
import { MicroserviceEnum } from '../../../../common/enum/microservice.enum';

bootstrap(MarketWorkerModule, MicroserviceEnum.MarketWorker);
