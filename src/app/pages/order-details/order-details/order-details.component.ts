import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {OrderService} from "../../../services/order.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {OrderDetailBookComponent} from "../order-detail-book/order-detail-book.component";
import {UserSidebarComponent} from "../../../components/user-sidebar/user-sidebar.component";
import {switchMap} from "rxjs";
import {VNDCurrencyPipe} from "../../../pipes/vnd-currency.pipe";
import {PaymentService} from "../../../services/payment.service";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [RouterLink, NgIf, OrderDetailBookComponent, NgForOf, DatePipe, UserSidebarComponent, VNDCurrencyPipe],
  templateUrl: './order-details.component.html',
  styles: ``
})
export class OrderDetailsComponent implements OnInit {
  @Input() order!: any;
  orderId!: number;
  totalPrice!: number;

  constructor(private activatedRoute: ActivatedRoute, private orderService: OrderService, private paymentService: PaymentService, private toastService: ToastService, private router: Router) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap(({id}) => {
        this.orderId = parseInt(id);
        return this.orderService.getOrderById(id);
      })
    ).subscribe({
      next: (order: any) => {
        this.order = order;
        this.totalPrice = this.order.orderDetails.reduce((previousValue: number, currentValue: any) => previousValue + currentValue.price, 0);
      },
      error: (err) => {
        if (err.status === 404) {
          this.router.navigate(["/404"])
        }
      }
    });
  }

  getOrderById() {
    this.orderService.getOrderById(this.orderId).subscribe((order: any) => {
      this.order = order;
    });
  }

  onPayment() {
    this.paymentService.createPayment(this.orderId).subscribe({
      next: (value: any) => {
        window.location.href = value.data;
      },
      error: (error: any) => {
        if (error.status === 403) {
          this.toastService.makeToast({
            icon: 'error',
            title: 'Đơn hàng đã được thanh toán!'
          });
          this.getOrderById();
        }
        else if (error.status === 404) {
          this.toastService.makeToast({
            icon: 'error',
            title: 'Đơn hàng đã bị xoá hoặc không tồn tại!'
          });
          this.getOrderById();
        }
      }
    });
  }

  onDeclined() {
    this.orderService.updateOrderStatus(this.orderId, 5).subscribe({
      next: () => {
        this.toastService.makeToast({
          icon: 'success',
          title: 'Huỷ đơn hàng thành công!'
        });
        this.getOrderById();
      },
      error: () => {
        this.toastService.makeToast({
          icon: 'warning',
          title: 'Đơn hàng đã thay đổi trạng thái!'
        });
        this.getOrderById();
      }
    });
  }
}
