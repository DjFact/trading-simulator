/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 31.07.2022 01:33
 */

export const generateCommandName = (cmd: string) => {
  return `${process.env.NODE_ENV}_${cmd}`;
};
