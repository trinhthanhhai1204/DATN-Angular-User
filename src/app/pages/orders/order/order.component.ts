import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {VNDCurrencyPipe} from "../../../pipes/vnd-currency.pipe";

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    RouterLink,
    VNDCurrencyPipe
  ],
  templateUrl: './order.component.html',
  styles: []
})
export class OrderComponent implements AfterViewInit {
  @ViewChild("orderHeader") orderHeader!: ElementRef;
  @ViewChild("orderBody") orderBody!: ElementRef;
  @ViewChild("orderFooter") orderFooter!: ElementRef;
  @Input() order!: any;
  @Output() onUpdateOrderStatus: EventEmitter<number> = new EventEmitter<number>();
  @Output() onPayment: EventEmitter<number> = new EventEmitter<number>();

  ngAfterViewInit(): void {
    let headerElement = this.orderHeader.nativeElement as HTMLDivElement;
    let bodyElement = this.orderBody.nativeElement as HTMLDivElement;
    let footerElement = this.orderFooter.nativeElement as HTMLDivElement;
    let actionElements = footerElement.children[0].querySelectorAll("a:nth-child(n + 1):nth-last-child(n + 2)");

    headerElement.onclick = () => {
      bodyElement.classList.toggle("d-none");
      actionElements.forEach((element: Element) => {
        element.classList.toggle("d-none");
      });
    }
  }

  getTotalPrice(order: any) {
    return order.orderDetails.reduce((previousValue: number, currentValue: any) => previousValue + currentValue.price, 0);
  }

  onPaymentRequest(id: number) {
    this.onPayment.emit(id);
  }

  onDeclined(id: number) {
    this.onUpdateOrderStatus.emit(id);
  }
}
