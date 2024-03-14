/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */

import { lookup, Lookup } from 'geoip-lite';
import { getClientIp } from 'request-ip';

export const getRequestIp = (req: any): string | number => {
  return getClientIp(req);
};

export const getGeoByIP = (ip: string | number): Lookup => {
  return lookup(ip);
};

export const getGeoByRequest = (req: any): Lookup => {
  return getGeoByIP(getRequestIp(req));
};
