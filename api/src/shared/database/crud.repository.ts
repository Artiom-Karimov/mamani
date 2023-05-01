export interface CrudRepository<TModel> {
  createOrUpdate(model: TModel): Promise<string | undefined>;
  get(id: string): Promise<TModel | undefined>;
  getByField(key: keyof TModel, value: unknown): Promise<TModel | undefined>;
  getByPartial(filter: Partial<TModel>): Promise<TModel | undefined>;
  delete(id: string): Promise<boolean | undefined>;
}
