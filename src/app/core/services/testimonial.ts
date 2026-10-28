import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { enviroment } from '../../../../enviroment/env';
import { Router } from '@angular/router';
import { ITestimonial, ITestimonialRes } from '../models/testimonial.model';

@Service()
export class TestimonialService {
  private _httpClient = inject(HttpClient);
  private _apiURL = enviroment.apiURL + 'testimonial/';
  private _router = inject(Router);

  getTestimonials() {
    return this._httpClient.get<ITestimonialRes>(this._apiURL);
  }

  getTestimonialsForAdmin() {
    return this._httpClient.get<ITestimonialRes>(this._apiURL + 'admin');
  }

  addTestimonial(data: { subject?: string; comment: string; rate: number }) {
    return this._httpClient.post<{ message: string; data: ITestimonial }>(this._apiURL, data);
  }

  updateTestimonialStatus(id: string, status: 'approved' | 'pending' | 'rejected') {
    return this._httpClient.patch<{ message: string; data: ITestimonial }>(`${this._apiURL}${id}/status`, { status });
  }

  deleteTestimonial(id: string) {
    return this._httpClient.delete<{ message: string }>(`${this._apiURL}${id}`);
  }
}

export { TestimonialService as Testimonial };
