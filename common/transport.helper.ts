/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */

export const generateCommandName = (cmd: string) => {
  return `${process.env.NODE_ENV}_${cmd}`;
};
