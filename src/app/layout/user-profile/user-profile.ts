import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user-service';
import { IUser } from '../../core/models/user.model';
import { TitleCasePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth-service';
import { tap } from 'rxjs';

@Component({
  imports: [TitleCasePipe],
  selector: 'app-user-profile',
  styleUrl: './user-profile.css',
  templateUrl: './user-profile.html',
})
export class UserProfile implements OnInit {
  private _userService = inject(UserService);
  private _authService = inject(AuthService);
  private _cdr = inject(ChangeDetectorRef);
  user!: IUser;
  ngOnInit(): void {
    this._authService.getUserData().subscribe({
      next: (res) => {
        if (!res) {
          return this._authService.logout();
        }
        this._userService.getUserByEmail(res.email).subscribe({
          next: (data) => {
            this.user = data.data;
            this._cdr.detectChanges();
          },
          error: (err) => console.error(err),
        });
      },
      error: (err) => console.error(err),
    });
  }
}
