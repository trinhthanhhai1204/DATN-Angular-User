import {Component, OnInit} from '@angular/core';
import {BookService} from "../../../services/book.service";
import {NgClass, NgForOf} from "@angular/common";
import {FormsModule, NgForm} from "@angular/forms";
import {AddressService} from "../../../services/address.service";
import {OrderService} from "../../../services/order.service";
import {Router} from "@angular/router";
import {PaymentService} from "../../../services/payment.service";
import {VNDCurrencyPipe} from "../../../pipes/vnd-currency.pipe";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-billing', standalone: true, imports: [
    NgForOf,
    FormsModule,
    NgClass,
    VNDCurrencyPipe
  ],
  templateUrl: './billing.component.html',
  styles: ``
})
export class BillingComponent implements OnInit {
  customerId!: number;
  fullName: string = "Nguyễn Văn A";
  phone: string = "0312456789";

  cart: any[] = [];
  cartMap: any[] = [];
  totalPrice: number = 0;

  orderDetails: any[] = [];

  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];

  province: string = "";
  district: string = "";
  ward: string = "";

  wasValidated = false;
  paymentMethod: string = "0";

  constructor(private bookService: BookService, private addressService: AddressService, private orderService: OrderService, private router: Router, private paymentService: PaymentService, private toastService: ToastService) {}

  ngOnInit() {
    let item = localStorage.getItem("samanhua-shop-current-user");
    if (item) {
      let parse = JSON.parse(item);
      this.customerId = parse.id;
    }

    this.cart = sessionStorage.getItem("samanhua-shop-cart") ? JSON.parse(sessionStorage.getItem("samanhua-shop-cart")!) : [];

    if (this.cart.length == 0) {
      this.router.navigate(["/cart"]);
    }

    this.fetchCartMap();
    this.getProvinces();
  }

  fetchCartMap() {
    this.cart.forEach((cartDto: any) => {
      this.bookService.getBookByOption(cartDto).subscribe((cartMapDto: any) => {
        this.orderDetails.push({
          option: {
            id: cartMapDto.book.options[0].id
          },
          quantity: cartMapDto.quantity,
          price: cartMapDto.quantity * cartMapDto.book.price
        });
        this.cartMap.push(cartMapDto);
        this.orderDetails = this.orderDetails.sort((a: any, b: any) => {
          return b.option.id - a.option.id;
        });
        this.cartMap = this.cartMap.sort((a: any, b: any) => b.time - a.time);
        this.totalPrice = this.cartMap.reduce((previousValue: number, currentValue: any) => {
          let currentPrice = currentValue.quantity * currentValue.book.price;
          return previousValue + currentPrice;
        }, 0);
      });
    })
  }

  createOrder(billing: NgForm) {
    this.wasValidated = true;

    if (!billing.valid) {
      this.toastService.makeToast({
        icon: "error",
        title: "Các trường chưa được nhập hợp lệ!"
      });
      return;
    }

    let {address, fullName, phone} = billing.value;
    let province = parseInt(this.province);
    let district = parseInt(this.district);
    let ward = parseInt(this.ward);
    let paymentMethod = parseInt(this.paymentMethod);
    let orderStatus = paymentMethod === 1 ? 0 : 1;
    let o: any = {
      consigneeName: fullName,
      customer: this.customerId,
      orderDetails: this.orderDetails,
      paymentMethod, orderStatus, address, phone, ward, district, province
    }
    this.orderService.saveOrder(o).subscribe({
      next: (orderId: number) => {
        sessionStorage.setItem("samanhua-shop-cart", "[]");
        if (paymentMethod == 1) {
          this.paymentService.createPayment(orderId).subscribe((value: any) => {
            window.location.href = value.data;
          });
        }
        else {
          this.toastService.makeToast({
            icon: "success",
            title: "Đặt hàng thành công!"
          });
          this.router.navigate(["/orders"]);
        }
      },
      error: (err) => {
        if (err.status === 400) {
          this.toastService.makeToast({
            icon: "error",
            title: "Số lượng tập truyện không hợp lệ!"
          });
          this.router.navigate(["/cart"]);
        }
      }
    });
  }

  getProvinces() {
    this.addressService.getProvinces().subscribe((provinces: any[]) => {
      this.provinces = provinces;
    });
  }

  onProvinceChange($event: Event) {
    let target = $event.target as HTMLSelectElement;
    let value = target.value;
    if (value !== "") {
      this.addressService.getDistricts(value).subscribe((districts: any) => {
        this.districts = districts;
      });
    }
    else {
      this.districts = [];
    }
    this.district = "";
    this.ward = "";
  }

  onDistrictChange($event: Event) {
    let target = $event.target as HTMLSelectElement;
    let value = target.value;
    if (value !== "") {
      this.addressService.getWards(value).subscribe((wards: any[]) => {
        this.wards = wards;
      });
    }
    else {
      this.wards = [];
    }
    this.ward = "";
  }
}
