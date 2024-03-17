/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 17.03.2024 11:34
 */
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class WsThrottlerGuard extends ThrottlerGuard {
  async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
  ): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const req = client.handshake;
    let ip =
      req.headers['x-forwarded-for'] ||
      req.connection?.remoteAddress ||
      req.address ||
      '';
    // If there are multiple IP addresses in the x-forwarded-for header, get the first one
    if (ip.includes(',')) {
      ip = ip.split(',')[0];
    }
    // If the IP address is in IPv6 format, convert it to IPv4
    if (ip.startsWith('::ffff:')) {
      ip = ip.substring(7);
    }
console.log('IP: ' + ip);
    const key = this.generateKey(context, ip, '');
    const { totalHits } = await this.storageService.increment(key, ttl);

    if (totalHits > limit) {
      throw new ThrottlerException();
    }

    return true;
  }
}
