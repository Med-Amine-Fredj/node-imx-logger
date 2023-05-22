type OptionsObject = Required<{
  hostname: string;
  port: number;
  username: string;
  password: string;
}> & {
  [key: string]: string | number | boolean;
};

export type connectOptionsType = string | OptionsObject;
