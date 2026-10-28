import { Component, inject, OnInit, signal } from '@angular/core';
import { NgClass, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user-service';
import { IUser } from '../../core/models/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [NgClass, TitleCasePipe, RouterLink, FormsModule],
  selector: 'app-user-list',
  styleUrl: './user-list.css',
  templateUrl: './user-list.html',
})
export class UserList implements OnInit {
  private _userService = inject(UserService);

  users = signal<IUser[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  deletingId = signal<string | null>(null);
  successMsg = signal<string | null>(null);
  searchTerm = signal('');

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this._userService.getAllUsers().subscribe({
      next: (res) => {
        this.users.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load users.');
        this.isLoading.set(false);
      },
    });
  }

  get filteredUsers(): IUser[] {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.users();
    return this.users().filter(
      (u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term),
    );
  }

  deleteUser(user: IUser) {
    if (!user._id) return;
    if (!confirm(`Delete user "${user.name}"?`)) return;
    this.deletingId.set(user._id);
    this._userService.deleteUser(user._id).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u._id !== user._id));
        this.deletingId.set(null);
        this.successMsg.set(`User "${user.name}" deleted.`);
        setTimeout(() => this.successMsg.set(null), 3000);
      },
      error: (err) => {
        this.deletingId.set(null);
        this.error.set(err?.error?.message || 'Failed to delete user.');
      },
    });
  }
}
