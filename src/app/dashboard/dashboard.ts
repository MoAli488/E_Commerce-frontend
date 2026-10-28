import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth-service';
import { IToken } from '../core/models/auth.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TitleCasePipe],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  userData = signal<IToken | null>(null);

  ngOnInit(): void {
    this._authService.getUserData().subscribe({
      next: (user) => this.userData.set(user),
    });
  }

  logout() {
    this._authService.logout();
    this._router.navigate(['/login']);
  }
}
