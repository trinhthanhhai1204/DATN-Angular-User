import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {UserService} from "../services/user.service";

export const tokenGuard: CanActivateFn = () => {
  let userService = inject(UserService);
  if (localStorage.getItem("samanhua-shop-current-user")) {
    let currentUser: any = JSON.parse(localStorage.getItem("samanhua-shop-current-user")!);
    let remaining = currentUser.exp - new Date().getTime();
    let expectTime = 1000 * 60 * 60 * 24 * 6;
    if (remaining <= 0) {
      localStorage.removeItem("samanhua-shop-user-token");
      localStorage.removeItem("samanhua-shop-current-user");
    }
    else if (remaining < expectTime) {
      userService.refreshToken().subscribe((jwt: any) => {
        let userInfo: any = {
          id: jwt.id,
          avatar: jwt.avatar,
          exp: new Date(jwt.exp).getTime(),
          role: jwt.role,
          subject: jwt.subject
        }
        localStorage.setItem("samanhua-shop-user-token", jwt.token);
        localStorage.setItem("samanhua-shop-current-user", JSON.stringify(userInfo));
      });
    }
  }
  return true;
};
