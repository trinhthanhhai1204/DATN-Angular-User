import {Component} from '@angular/core';
import {NgClass} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {
  FormsModule, NgForm
} from "@angular/forms";
import {AuthenticationService} from "../../../services/authentication.service";
import {UserSidebarComponent} from "../../../components/user-sidebar/user-sidebar.component";
import {ToastService} from "../../../services/toast.service";
import {SweetAlertIcon} from "sweetalert2";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgClass,
    UserSidebarComponent
  ],
  templateUrl: './change-password.component.html',
  styles: []
})
export class ChangePasswordComponent {
  isSubmitted: boolean = false;
  oldPassword: string = "";
  newPassword: string = "";
  confirmPassword: string = "";

  constructor(private router: Router, private authenticationService: AuthenticationService, private toastService: ToastService) {
  }

  makeToast(title: string, icon: SweetAlertIcon = "error"): void {
    this.toastService.makeToast({
      icon, title
    });
  }

  onChangePassword(changePassword: NgForm) {
    this.isSubmitted = true;

    if (!changePassword.valid) {
      this.makeToast("Các trường chưa được nhập hợp lệ!")
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.makeToast("Mật khẩu và xác nhận mật khẩu không trùng nhau!")
      return;
    }

    this.authenticationService.changePassword({oldPassword: this.oldPassword, newPassword: this.newPassword}).subscribe({
      next: () => {
        this.makeToast("Đổi mật khẩu thành công!", "success");
        this.router.navigate(["/user"]);
      },
      error: (err) => {
        let wrongPassword = err.status === 401 && err.error.msg === "Wrong password";
        this.makeToast(wrongPassword ? "Sai mật khẩu" : "Có lỗi xảy ra");
      }
    });
  }
}
