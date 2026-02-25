declare type HttpResponse<T> = {
  code: number;
  data: T;
  msg: string;
  success: boolean;
};
