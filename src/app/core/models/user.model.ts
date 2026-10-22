import { IAddress } from './address.model';

export interface IUser {
  name: string;
  email: string;
  phone?: string;
  addresses?: IAddress[];
  role: string;
  isBlocked: boolean;
}

export interface IUserListRes {
  message: string;
  data: IUser[];
}

export interface IUserRes {
  message: string;
  data: IUser;
}
