/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */

export class LoyaltyProgramException extends Error {
  constructor(
    public readonly message: string,
    public readonly code: number = 500,
    public readonly context?: any,
  ) {
    super();
  }
}
