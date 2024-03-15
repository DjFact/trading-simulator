/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */

export class TotalDataEntity<T> {
  constructor(
    public rows: T,
    public total: number,
  ) {}
}
