import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user-service';
import { ProductService } from '../../core/services/product-service';
import { OrderService } from '../../core/services/order-service';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private _userService = inject(UserService);
  private _productService = inject(ProductService);
  private _orderService = inject(OrderService);

  userCount = signal<number | null>(null);
  productCount = signal<number | null>(null);
  orderCount = signal<number | null>(null);
  pendingOrders = signal<number | null>(null);

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
        this.pendingOrders.set(res.data.filter((o) => o.status === 'pending').length);
      },
      error: () => this.orderCount.set(0),
    });
  }
}
