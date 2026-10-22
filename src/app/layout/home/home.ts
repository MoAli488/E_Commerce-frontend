import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ICategory } from '../../core/models/category.model';
import { enviroment } from '../../../../enviroment/env';
import { IProduct } from '../../core/models/product.model';
import { RouterLink } from '@angular/router';

@Component({
  imports: [NgClass, RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  activeCategory = '';
  staticURL = enviroment.staticURL;
  categories!: ICategory[];
  sampleProducts!: IProduct[];
  doActive(category: ICategory) {
    this.activeCategory = category.slug;
  }
}
