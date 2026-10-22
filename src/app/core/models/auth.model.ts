export interface ILoginRes {
  message: string;
  token: string;
}

export interface ILoginReq {
  email: string;
  password: string;
}

export interface ISignupReq {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IToken {
  _id: string;
  name: string;
  email: string;
  role: string;
  exp: number;
}
