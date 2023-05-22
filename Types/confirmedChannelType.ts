export type confirmChannelType = {
  publish: (
    exchange: any,
    routingKey: any,
    content: any,
    options: any,
    cb: any
  ) => any;
  sendToQueue: (queue: any, content: any, options: any, cb: any) => any;
  waitForConfirms: () => Promise<any[]>;
};
