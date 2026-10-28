import { ICart } from './cart.model';
import { IUser } from './user.model';

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled by admin'
  | 'cancelled by client'
  | 'rejected'
  | 'refunded';

export interface OrderItem {
  _id: string;
  order: string;
  item: string;
  name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  _id: string;
  user: IUser;
  cart: ICart;
  orderItems: OrderItem[];
  address: string;
  phone: string;
  status: OrderStatus;
  orderedAt?: string | Date;
  createdAt?: string | Date;
}

export interface IOrderRes {
  message: string;
  data: Order;
}

export interface IOrderListRes {
  message: string;
  data: Order[];
}

export interface IMakeOrderReq {
  phone?: string;
  address?: string;
  addressId?: string;
}

export interface IUpdateOrderStatusReq {
  id: string;
  status: string;
}
