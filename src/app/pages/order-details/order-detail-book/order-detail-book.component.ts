import {Component, Input} from '@angular/core';
import {VNDCurrencyPipe} from "../../../pipes/vnd-currency.pipe";

@Component({
  selector: 'app-order-detail-book',
  standalone: true,
  imports: [
    VNDCurrencyPipe
  ],
  templateUrl: './order-detail-book.component.html',
  styles: []
})
export class OrderDetailBookComponent {
  @Input() orderDetail!: any;

}
