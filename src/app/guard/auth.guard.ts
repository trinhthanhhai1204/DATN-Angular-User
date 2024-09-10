import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route) => {
  let router = inject(Router);
  return !!localStorage.getItem("samanhua-shop-current-user") && !!localStorage.getItem("samanhua-shop-user-token") ? true : router.navigate(["/login"], {queryParams: {redirect: route.routeConfig?.path}});
};
