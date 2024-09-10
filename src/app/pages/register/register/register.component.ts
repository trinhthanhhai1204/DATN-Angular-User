import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormsModule, NgForm} from "@angular/forms";
import {AuthenticationService} from "../../../services/authentication.service";
import {ToastService} from "../../../services/toast.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgClass
  ],
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent {
  isSubmitted: boolean = false;
  gender: string = "male";

  constructor(private authenticationService: AuthenticationService, private router: Router, private toastService: ToastService) {}

  onRegister(register: NgForm) {
    this.isSubmitted = true;

    if (register.valid) {
      let {confirmPassword, password, username} = register.value;
      if (confirmPassword === password) {
        let r = {username, password}
        this.authenticationService.onRegister(r).subscribe({
          next: (jwt: any) => {
            let {id, avatar, role, subject, exp} = jwt;
            let userInfo: any = {
              id, avatar, exp: new Date(exp).getTime(), role, subject
            };
            localStorage.setItem("samanhua-shop-user-token", jwt.token);
            localStorage.setItem("samanhua-shop-current-user", JSON.stringify(userInfo));
            this.router.navigate(["/"]);
          },
          error: (err) => {
            if (err.status === 403) {
              this.toastService.makeToast({
                icon: "error",
                title: "Tên người dùng đã tồn tại"
              });
            }
          }
        })
      }
      else {
        this.toastService.makeToast({
          icon: "error",
          title: "Mật khẩu và xác nhận mật khẩu không trùng nhau!"
        });
      }
    }
    else {
      this.toastService.makeToast({
        icon: "error",
        title: "Các trường chưa được nhập hợp lệ!"
      });
    }
  }
}
