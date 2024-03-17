/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 17.03.2024 11:34
 */
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';
import { getRequestIp } from '../../../../../common/request.utils';

@Injectable()
export class WsThrottlerGuard extends ThrottlerGuard {
  async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
  ): Promise<boolean> {
    const client = context.switchToWs().getClient();
    let ip = String(getRequestIp(client.handshake));
    // If there are multiple IP addresses in the x-forwarded-for header, get the first one
    if (ip.includes(',')) {
      ip = ip.split(',')[0];
    }
    // If the IP address is in IPv6 format, convert it to IPv4
    if (ip.startsWith('::ffff:')) {
      ip = ip.substring(7);
    }

    const key = this.generateKey(context, ip, '');
    const { totalHits } = await this.storageService.increment(key, ttl);

    if (totalHits > limit) {
      throw new ThrottlerException();
    }

    return true;
  }
}
