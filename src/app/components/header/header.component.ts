import {Component, Input} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent {
  @Input() isLogin!: boolean;
  @Input() avatar!: string;

  constructor(private router: Router) {}

  onLogOut() {
    localStorage.removeItem("samanhua-shop-user-token");
    localStorage.removeItem("samanhua-shop-current-user");
    sessionStorage.removeItem("samanhua-shop-cart");
    this.isLogin = false;
    this.avatar = "";
    this.router.navigate(["/"]);
  }
}
