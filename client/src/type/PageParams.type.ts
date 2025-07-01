export type TitleParams = {
  params: Promise<{title: string}>;
};

export type UUIDParams = {
  params: Promise<{uuid: string}>;
};

export type LogParams = {
  params: Promise<{title: string; logId: string}>;
};

export type UUIDLogParams = {
  params: Promise<{uuid: string; logId: string}>;
};
