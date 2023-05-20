export class PageDto<T> {
  page: number;
  pageSize: number;
  pagesTotal: number;
  elementsTotal: number;
  elements: T[];

  constructor(pageSize: number, page = 1, pagesTotal = 0, elementsTotal = 0) {
    this.pageSize = pageSize;
    this.page = page;
    this.pagesTotal = pagesTotal;
    this.elementsTotal = elementsTotal;
    this.elements = [];
  }

  add(...elements: T[]): PageDto<T> {
    this.elements.push(...elements);
    return this;
  }
}
