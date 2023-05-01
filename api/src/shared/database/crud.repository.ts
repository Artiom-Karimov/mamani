export interface CrudRepository<TModel> {
  createOrUpdate(model: TModel): Promise<string | undefined>;
  get(id: string): Promise<TModel | undefined>;
  delete(id: string): Promise<boolean | undefined>;
}
