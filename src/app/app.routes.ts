import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Home as HomeLayout } from './layout/home/home';
import { Login } from './layout/login/login';
import { Signup } from './layout/signup/signup';
import { ProductList } from './layout/product-list/product-list';
import { ProductDetails } from './layout/product-list/product-details/product-details';
import { Dashboard } from './dashboard/dashboard';
import { CreateProduct } from './dashboard/create-product/create-product';
import { Home as HomeDashboard } from './dashboard/home/home';
import { NotFound } from './shared/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeLayout },
      { path: 'login', component: Login },
      { path: 'signup', component: Signup },
      { path: 'product-list', component: ProductList },
      { path: 'product-details/:slug', component: ProductDetails },
    ],
  },
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeDashboard },
      { path: 'create-product', component: CreateProduct },
    ],
  },
  { path: '**', component: NotFound },
];
