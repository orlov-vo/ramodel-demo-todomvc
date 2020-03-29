export type Values<Object> = Object[keyof Object];

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};
