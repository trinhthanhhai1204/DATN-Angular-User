import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterModule, RouterOutlet} from '@angular/router';
import {NgFor} from '@angular/common';
import {BookComponent} from "./components/book/book.component";
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import {IndexComponent} from "./pages/home-page/index/index.component";
import {filter} from "rxjs";
import swal, {SweetAlertOptions} from "sweetalert2";
import {ToastService} from "./services/toast.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, BookComponent, HeaderComponent, FooterComponent, IndexComponent, RouterModule],
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {
  isLogin = false;
  avatar: string = "";

  Toast: any = swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000
  });

  constructor(private router: Router, private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        let item = localStorage.getItem("samanhua-shop-current-user");
        this.avatar = item ? `http://localhost:8080/api/v1/file${JSON.parse(item).avatar}` : "";
        this.isLogin = !!item;
      }
    );
    this.toastService.toastObservable.subscribe((value: SweetAlertOptions) => {
      if (value !== null) {
        this.Toast.fire(value);
      }
    });
  }
}
