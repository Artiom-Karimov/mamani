export interface CrudRepository<TModel> {
  createOrUpdate(model: TModel): Promise<string>;
  get(id: string): Promise<TModel>;
  delete(id: string): Promise<boolean>;
}
