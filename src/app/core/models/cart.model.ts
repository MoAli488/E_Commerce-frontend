import { IProduct } from './product.model';

export interface ICartItem {
  _id: string;
  cart: string; // cartId
  item: IProduct;
  oldPrice?: number;
  quantity: number;
  isPriceChanged?: boolean;
}

export interface ICart {
  _id: string;
  user: string;
  cartItems: ICartItem[];
}

export interface ICartRes {
  message: string;
  data: ICart;
}

export interface ICartReq {
  item: string;
  quantity: number;
}
