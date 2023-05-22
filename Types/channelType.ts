export type ChannelType = {
  rpc: (method: any, fields: any, expect: any) => Promise<any>;
  open: () => Promise<any>;
  close: () => Promise<any>;
  assertQueue: (queue: any, options: any) => Promise<any>;
  checkQueue: (queue: any) => Promise<any>;
  deleteQueue: (queue: any, options: any) => Promise<any>;
  purgeQueue: (queue: any) => Promise<any>;
  bindQueue: (queue: any, source: any, pattern: any, argt: any) => Promise<any>;
  unbindQueue: (
    queue: any,
    source: any,
    pattern: any,
    argt: any
  ) => Promise<any>;
  assertExchange(
    exchange: any,
    type: any,
    options: any
  ): Promise<{
    exchange: any;
  }>;
  checkExchange: (exchange: any) => Promise<any>;
  deleteExchange: (name: any, options: any) => Promise<any>;
  bindExchange: (
    dest: any,
    source: any,
    pattern: any,
    argt: any
  ) => Promise<any>;
  unbindExchange: (
    dest: any,
    source: any,
    pattern: any,
    argt: any
  ) => Promise<any>;
  publish: (exchange: any, routingKey: any, content: any, options: any) => any;
  sendToQueue: (queue: any, content: any, options: any) => any;
  consume: (queue: any, callback: any, options: any) => Promise<any>;
  cancel: (consumerTag: any) => Promise<void>;
  get: (queue: any, options: any) => Promise<any>;
  ack: (message: any, allUpTo: any) => void;
  ackAll: () => void;
  nack: (message: any, allUpTo: any, requeue: any) => void;
  nackAll: (requeue: any) => void;
  reject: (message: any, requeue: any) => void;
  recover: () => Promise<any>;
  qos: (count: any, global: any) => Promise<any>;
};
