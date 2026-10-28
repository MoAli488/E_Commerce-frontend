import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ITestimonial } from '../../../core/models/testimonial.model';

@Component({
  selector: 'app-testimonial-card, app-testimonialCard',
  imports: [DatePipe],
  templateUrl: './testimonial-card.html',
  styleUrl: './testimonial-card.css',
})
export class TestimonialCard {
  @Input() testimonial!: ITestimonial;

  // Aliases for convenience
  @Input() set item(val: ITestimonial) {
    this.testimonial = val;
  }
  @Input() set testimonialCard(val: ITestimonial) {
    this.testimonial = val;
  }
}

export { TestimonialCard as testimonialCard };
