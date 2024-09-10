import { Component } from '@angular/core';
import {DatePipe, NgForOf} from "@angular/common";
import {OrderDetailBookComponent} from "../../order-details/order-detail-book/order-detail-book.component";
import {UserSidebarComponent} from "../../../components/user-sidebar/user-sidebar.component";
import {VNDCurrencyPipe} from "../../../pipes/vnd-currency.pipe";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-404',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    OrderDetailBookComponent,
    UserSidebarComponent,
    VNDCurrencyPipe,
    RouterLink
  ],
  templateUrl: './404.component.html',
  styles: ``
})
export class PageNotFoundComponent {

}
