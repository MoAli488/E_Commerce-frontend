import { Component, inject } from '@angular/core';
import { UserService } from '../../core/services/user-service';
import { IUser } from '../../core/models/user.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  imports: [TitleCasePipe],
  selector: 'app-user-profile',
  styleUrl: './user-profile.css',
  templateUrl: './user-profile.html',
})
export class UserProfile {
  private _userService = inject(UserService);
  user!: IUser;
}
