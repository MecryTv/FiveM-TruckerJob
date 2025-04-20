export interface UIMessage<T = any> {
  action: string;
  data: T;
}
