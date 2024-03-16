/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */

export class TradingSimulatorException extends Error {
  constructor(
    public readonly message: string,
    public readonly code: number = 500,
    public readonly context?: any,
  ) {
    super();
  }
}
