import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/footer/footer';
import { AuthService } from './core/services/auth-service';
import { CartService } from './core/services/cart-service';

@Component({
  imports: [RouterOutlet, Footer],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  private _authService = inject(AuthService);
  private _cartService = inject(CartService);
  ngOnInit(): void {
    if (!this._authService.ifAuthorized('user'))
      return this._authService.logout();
    this._cartService.mergeCart();
  }
}
