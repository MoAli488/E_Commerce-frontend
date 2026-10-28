import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Home as HomeLayout } from './layout/home/home';
import { Login } from './layout/login/login';
import { Signup } from './layout/signup/signup';
import { ProductList } from './layout/product-list/product-list';
import { ProductDetails } from './layout/product-list/product-details/product-details';
import { UserProfile } from './layout/user-profile/user-profile';
import { Cart } from './layout/cart/cart';
import { Checkout } from './layout/cart/checkout/checkout';
import { Orders } from './layout/orders/orders';
import { InfoPage } from './layout/info-page/info-page';

import { Dashboard } from './dashboard/dashboard';
import { Home as HomeDashboard } from './dashboard/home/home';
import { CreateProduct } from './dashboard/create-product/create-product';
import { ProductList as DashboardProductList } from './dashboard/product-list/product-list';
import { UserList } from './dashboard/user-list/user-list';
import { CreateUser } from './dashboard/create-user/create-user';
import { OrderList } from './dashboard/order-list/order-list';
import { Testimonial as DashboardTestimonial } from './dashboard/testimonial/testimonial';

import { NotFound } from './shared/not-found/not-found';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { guestGuard } from './core/guards/guest-guard';
import { signupGuard } from './core/guards/signup-guard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeLayout },
      { path: 'login', component: Login, canActivate: [guestGuard] },
      {
        path: 'signup',
        component: Signup,
        canActivate: [guestGuard],
        canDeactivate: [signupGuard],
      },
      {
        path: 'user-profile',
        component: UserProfile,
        canActivate: [authGuard],
      },
      { path: 'product-list', component: ProductList },
      { path: 'product-details/:slug', component: ProductDetails },
      {
        path: 'cart',
        component: Cart,
      },
      {
        path: 'cart/checkout',
        component: Checkout,
        canActivate: [authGuard],
      },
      {
        path: 'orders',
        component: Orders,
        canActivate: [authGuard],
      },
      { path: 'info/:page', component: InfoPage },
      { path: 'about', redirectTo: 'info/about', pathMatch: 'full' },
      { path: 'contact', redirectTo: 'info/contact', pathMatch: 'full' },
      { path: 'faq', redirectTo: 'info/faq', pathMatch: 'full' },
      { path: 'policies', redirectTo: 'info/policies', pathMatch: 'full' },
    ],
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeDashboard },
      { path: 'products', component: DashboardProductList },
      { path: 'create-product', component: CreateProduct },
      { path: 'orders', component: OrderList },
      { path: 'users', component: UserList },
      { path: 'create-user', component: CreateUser },
      { path: 'testimonials', component: DashboardTestimonial },
    ],
  },
  { path: '**', component: NotFound },
];
