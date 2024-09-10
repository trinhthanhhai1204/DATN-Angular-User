import {Component, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {OrderService} from "../../../services/order.service";
import {OrderComponent} from "../order/order.component";
import {UserSidebarComponent} from "../../../components/user-sidebar/user-sidebar.component";
import {FormsModule} from "@angular/forms";
import {ToastService} from "../../../services/toast.service";
import {PaymentService} from "../../../services/payment.service";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NgIf, RouterLink, NgForOf, DatePipe, OrderComponent, UserSidebarComponent, FormsModule, NgClass],
  templateUrl: './orders.component.html',
  styles: ``
})
export class OrdersComponent implements OnInit {
  customerId!: number;
  orderStatusList: any[] = [];
  orders: any[] = [];
  page: number = 0;
  pages: number = 1;
  count: number = 0;
  size: number = 10;
  sort: string = "0";
  status: string = "";
  pagesSequence: number[] = [];

  constructor(private orderService: OrderService, private toastService: ToastService, private paymentService: PaymentService) {}

  ngOnInit() {
    let item = localStorage.getItem("samanhua-shop-current-user");
    if (item) {
      let parse = JSON.parse(item);
      this.customerId = parse.id;
      this.orderService.getOrderStatusList().subscribe(status => {
        this.orderStatusList = status;
      });
      this.getOrders();
      this.getPages();
    }
  }

  getOrders() {
    let sort = parseInt(this.sort);
    this.orderService.getOrderByCustomerId(this.customerId, this.status, this.page, this.size, sort).subscribe((orders: any[]) => {
      this.orders = orders;
    });
  }

  onStatusChange() {
    this.sort = "0";
    this.getPages();
    this.setPage(0);
  }

  getPages() {
    this.orderService.getCountByCustomerId(this.customerId, this.status).subscribe((count: number) => {
      this.count = count;
      this.pages = Math.ceil(count / this.size);
      let sequence: number[] = [];
      for (let i = 0; i < this.pages; i++) {
        sequence.push(i + 1);
      }
      this.pagesSequence = sequence;
    });
  }

  setPage(i: number) {
    this.page = i;
    this.getOrders();
  }

  onPrevClick() {
    if (this.page != 0) {
      this.setPage(this.page - 1);
    }
  }

  onNextClick() {
    if (this.page != this.pages - 1) {
      this.setPage(this.page + 1);
    }
  }

  onUpdateOrderStatus($event: number) {
    this.orderService.updateOrderStatus($event, 5).subscribe({
      next: () => {
        this.toastService.makeToast({
          icon: 'success',
          title: 'Huỷ đơn hàng thành công!'
        });
        this.getOrders();
      },
      error: () => {
        this.toastService.makeToast({
          icon: 'warning',
          title: 'Đơn hàng đã thay đổi trạng thái!'
        });
        this.getOrders();
      }
    });
  }

  onPayment($event: number) {
    this.paymentService.createPayment($event).subscribe({
      next: (value: any) => {
        window.location.href = value.data;
      },
      error: (error: any) => {
        if (error.status === 403) {
          this.toastService.makeToast({
            icon: 'error',
            title: 'Đơn hàng đã được thanh toán!'
          });
        }
        else if (error.status === 404) {
          this.toastService.makeToast({
            icon: 'error',
            title: 'Đơn hàng đã bị xoá hoặc không tồn tại!'
          });
        }
        this.getOrders();
      }
    });
  }
}
