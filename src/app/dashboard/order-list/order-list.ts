import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, CurrencyPipe, TitleCasePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order-service';
import { Order, OrderStatus } from '../../core/models/order.model';

@Component({
  imports: [DatePipe, CurrencyPipe, TitleCasePipe, NgClass, FormsModule],
  selector: 'app-admin-order-list',
  styleUrl: './order-list.css',
  templateUrl: './order-list.html',
})
export class OrderList implements OnInit {
  private _orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  successMsg = signal<string | null>(null);
  updatingOrderId = signal<string | null>(null);

  searchTerm = signal('');
  statusFilter = signal<string>('all');

  availableStatuses: OrderStatus[] = [
    'pending',
    'preparing',
    'shipped',
    'delivered',
    'cancelled by admin',
    'rejected',
    'refunded',
  ];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    this.error.set(null);
    this._orderService.getAllOrders().subscribe({
      next: (res) => {
        this.orders.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load orders.');
        this.isLoading.set(false);
      },
    });
  }

  get filteredOrders(): Order[] {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return this.orders().filter((order) => {
      const matchesStatus = status === 'all' || order.status === status;

      const userName = (order.user?.name || '').toLowerCase();
      const userEmail = (order.user?.email || '').toLowerCase();
      const phone = (order.phone || '').toLowerCase();
      const orderId = (order._id || '').toLowerCase();
      const address = (order.address || '').toLowerCase();

      const matchesTerm =
        !term ||
        userName.includes(term) ||
        userEmail.includes(term) ||
        phone.includes(term) ||
        orderId.includes(term) ||
        address.includes(term);

      return matchesStatus && matchesTerm;
    });
  }

  getOrderTotal(order: Order): number {
    return order.orderItems.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0,
    );
  }

  updateStatus(order: Order, newStatus: string) {
    if (order.status === newStatus) return;
    this.updatingOrderId.set(order._id);

    this._orderService
      .updateOrderStatus({ id: order._id, status: newStatus })
      .subscribe({
        next: (res) => {
          this.orders.update((list) =>
            list.map((o) => (o._id === order._id ? { ...o, status: res.data.status } : o)),
          );
          this.updatingOrderId.set(null);
          this.successMsg.set(`Order #${order._id.slice(-6)} updated to "${newStatus}".`);
          setTimeout(() => this.successMsg.set(null), 3500);
        },
        error: (err) => {
          this.updatingOrderId.set(null);
          this.error.set(err?.error?.message || 'Failed to update order status.');
        },
      });
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
