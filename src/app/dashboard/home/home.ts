import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { UserService } from '../../core/services/user-service';
import { ProductService } from '../../core/services/product-service';
import { OrderService } from '../../core/services/order-service';
import { TestimonialService } from '../../core/services/testimonial';

@Component({
  imports: [RouterLink, CurrencyPipe],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private _userService = inject(UserService);
  private _productService = inject(ProductService);
  private _orderService = inject(OrderService);
  private _testimonialService = inject(TestimonialService);

  totalRevenue = signal<number | null>(null);
  userCount = signal<number | null>(null);
  productCount = signal<number | null>(null);
  orderCount = signal<number | null>(null);
  pendingOrders = signal<number | null>(null);
  testimonialCount = signal<number | null>(null);
  pendingTestimonials = signal<number | null>(null);

  ngOnInit(): void {
    this._userService.getAllUsers().subscribe({
      next: (res) => this.userCount.set(res.data.length),
      error: () => this.userCount.set(0),
    });

    this._productService.getAllProducts().subscribe({
      next: (res) => this.productCount.set(res.data.length),
      error: () => this.productCount.set(0),
    });

    this._orderService.getAllOrders().subscribe({
      next: (res) => {
        this.orderCount.set(res.data.length);
        this.pendingOrders.set(
          res.data.filter((o) => o.status === 'pending').length,
        );
      },
      error: () => this.orderCount.set(0),
    });

    this._orderService.getOrderStats().subscribe({
      next: (res) => {
        if (res.data) {
          this.totalRevenue.set(res.data.totalRevenue || 0);
        }
      },
      error: () => this.totalRevenue.set(0),
    });

    this._testimonialService.getTestimonialsForAdmin().subscribe({
      next: (res) => {
        const list = res.data || [];
        this.testimonialCount.set(list.length);
        this.pendingTestimonials.set(
          list.filter((t) => t.status === 'pending').length,
        );
      },
      error: () => {
        this.testimonialCount.set(0);
        this.pendingTestimonials.set(0);
      },
    });
  }
}
