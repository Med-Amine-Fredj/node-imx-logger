type MessagePayload = {
  appName: string;
  context: string;
  message: string;
  user?: string;
  extra?: any;
  level: "debug" | "errors";
  date: Date;
};

export type messagePayloadType = {
  payload: MessagePayload;
};
