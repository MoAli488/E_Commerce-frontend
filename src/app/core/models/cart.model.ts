export interface CartItem {
  _id: string;
  cart: string;
  item: string;
  oldPrice?: number;
  quantity: number;
  isPriceChanged?: boolean;
}

export interface Cart {
  _id: string;
  user: string;
  cartItems: CartItem[];
}
