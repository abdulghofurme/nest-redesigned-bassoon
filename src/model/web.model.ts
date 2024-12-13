export class WebResponse<T> {
  data?: T;
  errorrs?: string;
  meta?: Meta;
}

export class Meta {
  current_page: number;
  total_page: number;
  size: number;
}
