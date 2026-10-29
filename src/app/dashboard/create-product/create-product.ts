import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ProductService } from '../../core/services/product-service';

@Component({
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  selector: 'app-create-product',
  styleUrl: './create-product.css',
  templateUrl: './create-product.html',
})
export class CreateProduct {
  private _productService = inject(ProductService);
  private _router = inject(Router);
  private _cdr = inject(ChangeDetectorRef);

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isSubmitting = false;
  statusMessage: { type: 'success' | 'error'; text: string } | null = null;

  productForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ],
    }),
    description: new FormControl('', {
      nonNullable: true,
    }),
    price: new FormControl(null, {
      validators: [Validators.required, Validators.min(0.01)],
    }),
    stock: new FormControl(1, {
      validators: [Validators.required, Validators.min(0)],
    }),
    category: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    subCategory: new FormControl(null),
  });

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this._cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    if (!this.selectedFile) {
      this.statusMessage = {
        type: 'error',
        text: 'Please upload a product image.',
      };
      return;
    }

    this.isSubmitting = true;
    this.statusMessage = null;

    const formData = new FormData();
    formData.append('title', this.productForm.controls.title.value);
    formData.append('description', this.productForm.controls.description.value);
    formData.append('price', String(this.productForm.controls.price.value));
    formData.append('stock', String(this.productForm.controls.stock.value));
    formData.append('category', this.productForm.controls.category.value);

    const subCategory = this.productForm.controls.subCategory.value;
    if (subCategory) {
      formData.append('subCategory', subCategory);
    }

    formData.append('img', this.selectedFile);

    this._productService.addProduct(formData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.statusMessage = {
          type: 'success',
          text: 'Product created successfully!',
        };
        this.productForm.reset();
        this.selectedFile = null;
      },
      error: (err) => {
        this.isSubmitting = false;
        this.statusMessage = {
          type: 'error',
          text:
            err?.error?.message ||
            'Failed to create product. Please verify all fields.',
        };
      },
    });
  }
}
