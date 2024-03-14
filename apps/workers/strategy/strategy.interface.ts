/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 14/03/2024 18:46
 */
import { OrderEntity } from '../../../common/entity/order.entity';

export interface IStrategy {
  processOrder(order: OrderEntity, closePrice: number): Promise<void>;
}
