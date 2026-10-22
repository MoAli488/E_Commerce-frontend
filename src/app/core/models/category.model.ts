export interface ICategory {
  name: string;
  slug: string;
}

export interface ISubCategory extends ICategory {
  category: string;
}