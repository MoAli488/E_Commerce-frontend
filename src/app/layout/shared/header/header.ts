import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { IToken } from '../../../core/models/auth.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  imports: [RouterLink, RouterLinkActive, TitleCasePipe],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header implements OnInit {
  private _authService = inject(AuthService);
  private _cdr = inject(ChangeDetectorRef);
  userData!: IToken | null;
  logout() {
    this._authService.logout();
  }
  ngOnInit(): void {
    this._authService.getUserData().subscribe({
      next: (data) => {
        this.userData = data;
        this._cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }
}
