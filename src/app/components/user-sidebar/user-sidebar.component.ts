import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './user-sidebar.component.html',
  styles: ``
})
export class UserSidebarComponent {
  constructor(private router: Router) {}

  onLogOut() {
    localStorage.removeItem("samanhua-shop-user-token");
    localStorage.removeItem("samanhua-shop-current-user");
    sessionStorage.removeItem("samanhua-shop-cart");
    this.router.navigate(["/"]);
  }
}
