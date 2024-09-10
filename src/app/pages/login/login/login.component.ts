import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormsModule, NgForm} from "@angular/forms";
import {AuthenticationService} from "../../../services/authentication.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent implements OnInit {
  redirect!: string;
  constructor(private loginService: AuthenticationService,private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem("samanhua-shop-user-token")) {
      this.router.navigate(["/user"]);
    }
    this.activatedRoute.queryParams.subscribe(({redirect}) => {
      this.redirect = redirect;
    });
  }

  onLogin(loginForm: NgForm) {
    let {username, password} = loginForm.value;
    this.loginService.onLogin({username, password}).subscribe((jwt: any) => {
      let {id, avatar, role, subject, exp} = jwt;
      let userInfo: any = {
        id, avatar, exp: new Date(exp).getTime(), role, subject
      };
      localStorage.setItem("samanhua-shop-user-token", jwt.token);
      localStorage.setItem("samanhua-shop-current-user", JSON.stringify(userInfo));
      if (!this.redirect) {
        this.router.navigate(["/"]);
      }
      else {
        this.router.navigate([`/${this.redirect}`]);
      }
    })
    loginForm.reset();
  }
}
