/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 19/04/2023 21:38
 */
import { Global, Module } from '@nestjs/common';
import { WsInstance } from './ws.instance';

@Global()
@Module({
  providers: [WsInstance],
  exports: [WsInstance],
})
export class WsModule {}
