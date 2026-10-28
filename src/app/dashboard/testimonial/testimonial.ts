import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestimonialService } from '../../core/services/testimonial';
import { ITestimonial } from '../../core/models/testimonial.model';

@Component({
  imports: [DatePipe, TitleCasePipe, FormsModule],
  selector: 'app-admin-testimonial',
  styleUrl: './testimonial.css',
  templateUrl: './testimonial.html',
})
export class Testimonial implements OnInit {
  private _testimonialService = inject(TestimonialService);

  testimonials = signal<ITestimonial[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  successMsg = signal<string | null>(null);

  updatingId = signal<string | null>(null);
  deletingId = signal<string | null>(null);

  searchTerm = signal('');
  statusFilter = signal<string>('all');
  rateFilter = signal<string>('all');

  ngOnInit(): void {
    this.loadTestimonials();
  }

  loadTestimonials(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this._testimonialService.getTestimonialsForAdmin().subscribe({
      next: (res) => {
        this.testimonials.set(res.data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(
          err?.error?.message || 'Failed to load testimonials for admin.',
        );
        this.isLoading.set(false);
      },
    });
  }

  get filteredTestimonials(): ITestimonial[] {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();
    const rate = this.rateFilter();

    return this.testimonials().filter((t) => {
      const matchesStatus = status === 'all' || t.status === status;
      const matchesRate = rate === 'all' || String(t.rate) === rate;

      const userName = (t.user?.name || '').toLowerCase();
      const userEmail = (t.user?.email || '').toLowerCase();
      const subject = (t.subject || '').toLowerCase();
      const comment = (t.comment || '').toLowerCase();

      const matchesTerm =
        !term ||
        userName.includes(term) ||
        userEmail.includes(term) ||
        subject.includes(term) ||
        comment.includes(term);

      return matchesStatus && matchesRate && matchesTerm;
    });
  }

  get totalCount(): number {
    return this.testimonials().length;
  }

  get pendingCount(): number {
    return this.testimonials().filter((t) => t.status === 'pending').length;
  }

  get approvedCount(): number {
    return this.testimonials().filter((t) => t.status === 'approved').length;
  }

  get rejectedCount(): number {
    return this.testimonials().filter((t) => t.status === 'rejected').length;
  }

  get averageRating(): string {
    const list = this.testimonials();
    if (list.length === 0) return '0.0';
    const sum = list.reduce((acc, curr) => acc + (curr.rate || 0), 0);
    return (sum / list.length).toFixed(1);
  }

  updateStatus(
    testimonial: ITestimonial,
    newStatus: 'approved' | 'pending' | 'rejected',
  ): void {
    if (!testimonial._id || testimonial.status === newStatus) return;

    this.updatingId.set(testimonial._id);
    this.error.set(null);

    this._testimonialService
      .updateTestimonialStatus(testimonial._id, newStatus)
      .subscribe({
        next: (res) => {
          this.testimonials.update((list) =>
            list.map((item) =>
              item._id === testimonial._id
                ? { ...item, status: res.data.status }
                : item,
            ),
          );
          this.updatingId.set(null);
          this.successMsg.set(
            `Review from ${testimonial.user?.name || 'Customer'} marked as "${newStatus}".`,
          );
          setTimeout(() => this.successMsg.set(null), 3500);
        },
        error: (err) => {
          this.updatingId.set(null);
          this.error.set(
            err?.error?.message || 'Failed to update testimonial status.',
          );
        },
      });
  }

  deleteTestimonial(testimonial: ITestimonial): void {
    if (!testimonial._id) return;
    const author = testimonial.user?.name || 'this customer';
    if (!confirm(`Are you sure you want to permanently delete the review by ${author}?`)) {
      return;
    }

    this.deletingId.set(testimonial._id);
    this.error.set(null);

    this._testimonialService.deleteTestimonial(testimonial._id).subscribe({
      next: () => {
        this.testimonials.update((list) =>
          list.filter((item) => item._id !== testimonial._id),
        );
        this.deletingId.set(null);
        this.successMsg.set(`Review by ${author} permanently removed.`);
        setTimeout(() => this.successMsg.set(null), 3500);
      },
      error: (err) => {
        this.deletingId.set(null);
        this.error.set(
          err?.error?.message || 'Failed to delete testimonial.',
        );
      },
    });
  }

  getStatusClass(status?: string): string {
    switch (status) {
      case 'approved':
        return 'status-badge status-badge--approved';
      case 'rejected':
        return 'status-badge status-badge--rejected';
      case 'pending':
      default:
        return 'status-badge status-badge--pending';
    }
  }

  getStarArray(rate: number): boolean[] {
    return [1, 2, 3, 4, 5].map((i) => i <= rate);
  }
}
