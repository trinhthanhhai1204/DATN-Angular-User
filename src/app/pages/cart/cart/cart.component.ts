import {Component, OnInit} from '@angular/core';
import {BookService} from "../../../services/book.service";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {from, map, mergeMap, toArray} from "rxjs";
import {VNDCurrencyPipe} from "../../../pipes/vnd-currency.pipe";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgForOf, FormsModule, NgIf, RouterLink, VNDCurrencyPipe],
  templateUrl: './cart.component.html',
  styles: ``
})
export class CartComponent implements OnInit {
  count: number = 0;
  cart: any[] = [];
  cartMap: any[] = [];
  totalPrice: number = 0;

  constructor(private bookService: BookService, private router: Router, private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.cart = sessionStorage.getItem("samanhua-shop-cart") ? JSON.parse(sessionStorage.getItem("samanhua-shop-cart")!) : [];
    from(this.cart).pipe(
      mergeMap((cartEntity: any) => this.bookService.getBookByOption(cartEntity).pipe(
        map((book: any) => {
          let quantity = Math.min(book.book.options[0]?.quantity, cartEntity.quantity);
          cartEntity.quantity = quantity;
          book.quantity = quantity;
          return book;
        })
      )),
      toArray()
    ).subscribe((books: any[]) => {
      this.cart = this.cart
        .filter((cartEntity) => cartEntity.quantity !== 0);
      this.count = this.cart.length;
      sessionStorage.setItem("samanhua-shop-cart", JSON.stringify(this.cart));
      this.cartMap = books
        .filter(book => book.quantity !== 0)
        .sort((a: any, b: any) => b.time - a.time);
      this.updateTotalPrice();
    });
  }

  onQuantityChange($event: Event, id: number) {
    let target = $event.target as HTMLInputElement;
    let currentCartMapDto = this.cartMap.find((value: any) => {
      return value.book.options[0].id == id;
    });
    let quantity: number;
    if (!isNaN(parseInt(target.value))) {
      target.value = `${parseInt(target.value)}`;
      quantity = parseInt(target.value);
    } else {
      quantity = 1;
      this.toastService.makeToast({
        icon: 'warning',
        title: 'Số lượng cần lớn hơn 0!'
      });
    }
    if (quantity > currentCartMapDto!.book.options[0].quantity) {
      quantity = currentCartMapDto!.book.options[0].quantity;
      this.toastService.makeToast({
        icon: 'warning',
        title: 'Số lượng vượt quá tối đa cho phép!'
      });
    } else if (quantity < 1) {
      quantity = 1;
      this.toastService.makeToast({
        icon: 'warning',
        title: 'Số lượng cần lớn hơn 0!'
      });
    }
    this.cart = this.cart.map((c: any) => {
      if (c.id == id) {
        c.quantity = quantity;
      }
      return c;
    });
    sessionStorage.setItem("samanhua-shop-cart", JSON.stringify(this.cart));
    this.cartMap = this.cartMap.map((c: any) => {
      if (c.book.options[0].id == id) {
        c.quantity = quantity;
      }
      return c;
    });
    this.updateTotalPrice();
  }

  onRemoveCartDto(id: number) {
    this.cart = this.cart.filter((c: any) => c.id != id);
    this.count = this.cart.length;
    sessionStorage.setItem("samanhua-shop-cart", JSON.stringify(this.cart));
    this.cartMap = this.cartMap.filter((c: any) => c.book.options[0].id != id);
    this.updateTotalPrice();
    this.toastService.makeToast({
      icon: 'success',
      title: `Đã xoá sách khỏi giỏ hàng!`
    });
  }

  updateTotalPrice() {
    this.totalPrice = this.cartMap.reduce((previousValue: number, currentValue: any) => {
      let currentPrice = currentValue.quantity * currentValue.book.price;
      return previousValue + currentPrice;
    }, 0);
  }

  onCheckOut() {
    if (this.cart.length != 0) {
      this.router.navigate(["/billing"]);
    }
  }
}
