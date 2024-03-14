export const generateQueueName = (cmd: string) => {
  return `${process.env.NODE_ENV}_${cmd}`;
};
