import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TestimonialService } from '../../core/services/testimonial';
import { AuthService } from '../../core/services/auth-service';
import { ITestimonial } from '../../core/models/testimonial.model';
import { IToken } from '../../core/models/auth.model';
import { TestimonialCard } from './testimonial-card/testimonial-card';

@Component({
  selector: 'app-testimonial',
  imports: [CommonModule, FormsModule, RouterLink, TestimonialCard],
  templateUrl: './testimonial.html',
  styleUrl: './testimonial.css',
})
export class Testimonial implements OnInit {
  private _testimonialService = inject(TestimonialService);
  private _authService = inject(AuthService);
  private _cdr = inject(ChangeDetectorRef);

  testimonials: ITestimonial[] = [];
  isLoading = true;
  currentUser: IToken | null = null;
  isLoggedIn = false;

  // Review Modal State
  isModalOpen = false;
  isSubmitting = false;
  submissionSuccess = false;
  formError = '';

  // Form Fields
  newRate = 5;
  newSubject = '';
  newComment = '';

  // Fallback testimonials if none are approved in the database yet
  readonly defaultTestimonials: ITestimonial[] = [
    {
      _id: 'default-1',
      user: { name: 'Elena Rostova', email: 'elena@example.com' },
      subject: 'Stunning craftsmanship and drape',
      comment:
        'The wool overcoat and neutral essentials completely surpassed my expectations. The fabrics feel substantial and the lines are effortless.',
      rate: 5,
      date: new Date('2026-03-15'),
      status: 'approved',
    },
    {
      _id: 'default-2',
      user: { name: 'Marcus Vance', email: 'marcus@example.com' },
      subject: 'Thoughtful everyday staples',
      comment:
        'Finally clothing that balances understated elegance with true daily comfort. Washed several times and the shape remains immaculate.',
      rate: 5,
      date: new Date('2026-03-02'),
      status: 'approved',
    },
    {
      _id: 'default-3',
      user: { name: 'Sophia Chen', email: 'sophia@example.com' },
      subject: 'Packaging, fit, and speed: 10/10',
      comment:
        'From prompt arrival in sustainable packaging to the precise fit of the knitwear, form has quickly become my go-to wardrobe label.',
      rate: 5,
      date: new Date('2026-02-18'),
      status: 'approved',
    },
  ];

  ngOnInit(): void {
    this._authService.getUserData().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.isLoggedIn = !!user;
        this._cdr.detectChanges();
      },
    });

    this.fetchTestimonials();
  }

  fetchTestimonials(): void {
    this.isLoading = true;
    this._testimonialService.getTestimonials().subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.testimonials = res.data;
        } else {
          this.testimonials = this.defaultTestimonials;
        }
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: () => {
        // Fallback to defaults when offline or initial load
        this.testimonials = this.defaultTestimonials;
        this.isLoading = false;
        this._cdr.detectChanges();
      },
    });
  }

  get averageRating(): string {
    if (!this.testimonials || this.testimonials.length === 0) return '5.0';
    const sum = this.testimonials.reduce((acc, curr) => acc + (curr.rate || 5), 0);
    return (sum / this.testimonials.length).toFixed(1);
  }

  openModal(): void {
    this.formError = '';
    this.submissionSuccess = false;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.newRate = 5;
    this.newSubject = '';
    this.newComment = '';
    this.formError = '';
    this.submissionSuccess = false;
  }

  setRating(rate: number): void {
    this.newRate = rate;
  }

  submitReview(): void {
    if (!this.newComment.trim() || this.newComment.trim().length < 3) {
      this.formError = 'Please provide a short comment sharing your experience.';
      return;
    }

    this.isSubmitting = true;
    this.formError = '';

    const payload = {
      subject: this.newSubject.trim() || undefined,
      comment: this.newComment.trim(),
      rate: this.newRate,
    };

    this._testimonialService.addTestimonial(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submissionSuccess = true;
        this.newSubject = '';
        this.newComment = '';
        this.newRate = 5;
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.formError =
          err?.error?.message || 'Failed to submit review. Please try again.';
        this._cdr.detectChanges();
      },
    });
  }
}
