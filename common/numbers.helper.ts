/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 16:41
 */

export function toFixed2Number(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
