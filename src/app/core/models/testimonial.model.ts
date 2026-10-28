export interface ITestimonial {
  _id?: string;
  user: {
    _id?: string;
    name: string;
    email: string;
  };
  subject?: string;
  comment: string;
  rate: number;
  status?: 'approved' | 'pending' | 'rejected';
  date?: Date | string;
  createdAt?: Date | string;
}

export interface ITestimonialRes {
  message: string;
  data: ITestimonial[];
  totalPages?: number;
}
