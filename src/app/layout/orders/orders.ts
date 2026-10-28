import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, CurrencyPipe, TitleCasePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order-service';
import { AuthService } from '../../core/services/auth-service';
import { Order } from '../../core/models/order.model';

@Component({
  imports: [DatePipe, CurrencyPipe, TitleCasePipe, NgClass, RouterLink],
  selector: 'app-orders',
  styleUrl: './orders.css',
  templateUrl: './orders.html',
})
export class Orders implements OnInit {
  private _orderService = inject(OrderService);
  private _authService = inject(AuthService);

  orders = signal<Order[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const token = this._authService.getUserData();
    token.subscribe({
      next: (userData) => {
        if (!userData) {
          this.error.set('Please log in to view your orders.');
          this.isLoading.set(false);
          return;
        }
        this._orderService.getUserOrders(userData._id).subscribe({
          next: (res) => {
            this.orders.set(res.data);
            this.isLoading.set(false);
          },
          error: (err) => {
            this.error.set(err?.error?.message || 'Failed to load orders.');
            this.isLoading.set(false);
          },
        });
      },
    });
  }

  getOrderTotal(order: Order): number {
    return order.orderItems.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0,
    );
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'status--pending',
      preparing: 'status--preparing',
      shipped: 'status--shipped',
      delivered: 'status--delivered',
      'cancelled by admin': 'status--cancelled',
      'cancelled by client': 'status--cancelled',
      rejected: 'status--cancelled',
      refunded: 'status--refunded',
    };
    return map[status] || 'status--pending';
  }
}
