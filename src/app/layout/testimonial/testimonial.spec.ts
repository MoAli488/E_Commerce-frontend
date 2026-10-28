import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Testimonial } from './testimonial';

describe('Testimonial', () => {
  let component: Testimonial;
  let fixture: ComponentFixture<Testimonial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Testimonial],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Testimonial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
