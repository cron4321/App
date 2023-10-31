export type MainBoard = {
  index: number;
  link: string;
  title: string;
  date: string;
};

export type UserSubscription = {
  userId: string;
  subscription: PushSubscription;
};

export type Store = {
  data: UserSubscription[];
};

export type PushMessage = {
  title: string;
  body: string;
  link: string;
};
