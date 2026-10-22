import { ICategory, ISubCategory } from './category.model';

export interface IProduct {
  _id: string;
  title: string;
  description: string;
  slug: string;
  price: number;
  category: ICategory;
  subCategory: ISubCategory;
  stock: number;
  imageURL: string;
}

export interface IProductReq {
  title: string;
  description: string;
  price: number;
  stock: number;
  category: ICategory;
  subCategory?: ISubCategory;
  img?: File;
}

export interface IProductsListRes {
  message: string;
  data: IProduct[];
}

export interface IProductRes {
  message: string;
  data: IProduct;
}
