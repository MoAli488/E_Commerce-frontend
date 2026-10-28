import { IAddress } from './address.model';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  addresses?: IAddress[];
  role: string;
  isBlocked: boolean;
  isDeleted?: boolean;
}

export interface IUserListRes {
  message: string;
  data: IUser[];
}

export interface IUserRes {
  message: string;
  data: IUser;
}
