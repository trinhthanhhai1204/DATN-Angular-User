import {Routes} from '@angular/router';
import {IndexComponent} from "./pages/home-page/index/index.component";
import {BooksComponent} from "./pages/books/books/books.component";
import {BookDetailsComponent} from "./pages/book-details/book-details/book-details.component";
import {CartComponent} from "./pages/cart/cart/cart.component";
import {LoginComponent} from "./pages/login/login/login.component";
import {UserComponent} from "./pages/user/user/user.component";
import {OrdersComponent} from "./pages/orders/orders/orders.component";
import {OrderDetailsComponent} from "./pages/order-details/order-details/order-details.component";
import {BillingComponent} from "./pages/billing/billing/billing.component";
import {ChangePasswordComponent} from "./pages/change-password/change-password/change-password.component";
import {EditInfoComponent} from "./pages/edit-info/edit-info/edit-info.component";
import {authGuard} from "./guard/auth.guard";
import {tokenGuard} from "./guard/token.guard";
import {RegisterComponent} from "./pages/register/register/register.component";
import {PageNotFoundComponent} from "./pages/404/404/page-not-found.component";
import {
  RedirectToPageNotFoundComponent
} from "./pages/redirects/redirect-to-page-not-found/redirect-to-page-not-found.component";

export const routes: Routes = [
  {path: '', component: IndexComponent, title: "Home Page - Samanhua Shop", canActivate:[tokenGuard]},
  {path: 'books', component: BooksComponent, title: "All Books - Samanhua Shop", canActivate:[tokenGuard]},
  {path: 'book-details/:id', component: BookDetailsComponent, title: "Book Details - Samanhua Shop", canActivate:[tokenGuard]},
  {path: 'cart', component: CartComponent, title: "Cart - Samanhua Shop", canActivate:[tokenGuard, authGuard]},
  {path: 'login', component: LoginComponent, title: "Login - Samanhua Shop", canActivate:[tokenGuard]},
  {path: 'register', component: RegisterComponent, title: "User - Samanhua Shop", canActivate: [tokenGuard]},
  {path: 'user', component: UserComponent, title: "User - Samanhua Shop", canActivate: [tokenGuard, authGuard]},
  {path: 'orders', component: OrdersComponent, title: "Orders - Samanhua Shop", canActivate: [tokenGuard, authGuard]},
  {path: 'order-details/:id', component: OrderDetailsComponent, title: "Order Details - Samanhua Shop", canActivate: [tokenGuard, authGuard]},
  {path: 'billing', component: BillingComponent, title: "Billing - Samanhua Shop", canActivate: [tokenGuard, authGuard]},
  {path: 'change-password', component: ChangePasswordComponent, title: "Change Password - Samanhua Shop", canActivate: [tokenGuard, authGuard]},
  {path: 'edit-info', component: EditInfoComponent, title: "Edit Info - Samanhua Shop", canActivate: [tokenGuard, authGuard]},
  {path: '404', component: PageNotFoundComponent, title: "Page Not Found - Samanhua Shop", canActivate:[tokenGuard]},
  {path: '**', component: RedirectToPageNotFoundComponent, canActivate:[tokenGuard]},
];
