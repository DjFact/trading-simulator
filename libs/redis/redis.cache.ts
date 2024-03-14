/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 03.11.2022 23:37
 */
import { Store, Cache } from 'cache-manager';

export interface RedisCache extends Cache {
  store: RedisStore;
}

export interface RedisStore extends Store {
  name: 'redis';
  getClient: () => any;
  isCacheableValue: (value: any) => boolean;
}
