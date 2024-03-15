/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
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
