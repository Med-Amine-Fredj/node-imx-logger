import { ChannelType } from "./channelType";
import { confirmChannelType } from "./confirmedChannelType";

export type createCoonectionResult = {
  close: () => void;
  createChannel: () => Promise<ChannelType>;
  createConfirmChannel: () => Promise<confirmChannelType>;
};
