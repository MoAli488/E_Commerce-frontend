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
  user: string | any; // User ID or populated User object
  cart: string | any; // Cart ID or populated Cart object
  orderItems: OrderItem[];
  address: string;
  phone: string;
  status: OrderStatus;
}

// Helper interface when placing a new order from the frontend
export interface CreateOrderDto {
  cart: string;
  orderItems: {
    item: string;
    name: string;
    quantity: number;
    unit_price: number;
  }[];
  address: string;
  phone: string;
}
