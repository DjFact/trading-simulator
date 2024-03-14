/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 29.04.2021 13:14
 */

export class TotalDataEntity<T> {
  constructor(
    public rows: T,
    public total: number,
  ) {}
}
