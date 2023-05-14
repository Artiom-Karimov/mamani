export class PageDto<T> {
  page: number;
  pageSize: number;
  pagesTotal: number;
  elementsTotal: number;
  elements: T[];
}
