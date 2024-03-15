/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Global, Module } from '@nestjs/common';
import { WsInstance } from './ws.instance';

@Global()
@Module({
  providers: [WsInstance],
  exports: [WsInstance],
})
export class WsModule {}
