import {Component, OnInit} from '@angular/core';
import {BookService} from "../../../services/book.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {CategoryService} from "../../../services/category.service";
import {OptionService} from "../../../services/option.service";
import {FormsModule} from "@angular/forms";
import {VNDCurrencyPipe} from "../../../pipes/vnd-currency.pipe";
import {ToastService} from "../../../services/toast.service";
import {ImageService} from "../../../services/image.service";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage,
    RouterLink,
    FormsModule,
    NgForOf,
    VNDCurrencyPipe,
    NgClass
  ],
  templateUrl: './book-details.component.html',
  styles: []
})
export class BookDetailsComponent implements OnInit {
  book!: any;
  bookId!: number;
  categories: any[] = [];
  currentOption!: any;
  currentOptionId: string = "";
  options: any[] = [];
  maxQuantity: number = 0;
  quantity: number = 1;
  cart: any[] = [];
  images: any[] = [];
  carouselItems: any[] = [];

  constructor(private bookService: BookService, private categoryService: CategoryService, private optionService: OptionService, private activatedRoute: ActivatedRoute, private toastService: ToastService, private imageService: ImageService, private router: Router) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap(({id}) => {
        this.bookId = parseInt(id);
        return this.bookService.getBookById(this.bookId);
      })
    ).subscribe({
      next: (book: any) => {
        this.book = book;
        this.categoryService.getCategoriesByBook(this.bookId).pipe(
          switchMap((categories: any[]) => {
            this.categories = categories;
            return this.optionService.getOptionByBookId(this.bookId);
          }),
          switchMap((options: any[]) => {
            this.options = options;
            if (this.options.length != 0) {
              this.activatedRoute.queryParams.subscribe(({optionId}) => {
                const id = parseInt(optionId);
                this.currentOption = this.options.find((option: any) => {
                  return option.id == id;
                }) || this.options[0];
                this.maxQuantity = this.currentOption.quantity;
                this.currentOptionId = `${this.currentOption.id}`;
              });
              this.quantity = this.currentOption.quantity == 0 ? 0 : 1;
            }
            this.cart = sessionStorage.getItem("samanhua-shop-cart")? JSON.parse(sessionStorage.getItem("samanhua-shop-cart")!): [];
            return this.imageService.getImagesByBookId(this.bookId);
          })
        ).subscribe((images: any) => {
          if (this.currentOption) {
            images.unshift({src: this.currentOption.image});
          }
          images.unshift({src: this.book.image});
          this.images = images;
          let carouselCount = Math.ceil(images.length / 4);
          for (let i = 0; i < carouselCount; i++) {
            let slice = images.slice(i * 4, i * 4 + 4);
            let carouselItem = slice.map((image: any) => image.src);
            this.carouselItems.push(carouselItem);
          }
        });
      },
      error: (err) => {
        if (err.status === 404) {
          this.router.navigate(["/404"])
        }
      }
    });
  }

  onOptionChange(event: Event): void {
    let target = event.target as HTMLSelectElement;
    let currentOptionId = parseInt(target.value);
    this.currentOption = this.options.find((option: any) => {
      return option.id == currentOptionId;
    }) || this.options[0];
    this.maxQuantity = this.currentOption.quantity;
    let images = this.images;
    images[1] = {src: this.currentOption.image};
    this.book.image = images[0].src;
    this.carouselItems[0][1] = images[1].src;
    this.currentOptionId = `${this.currentOption.id}`;
    this.quantity = this.currentOption.quantity == 0 ? 0 : 1;
  }

  onAddToCart() {
    if (this.currentOption) {
      if (this.quantity != 0) {
        let optionId = this.currentOption.id;
        let quantity = this.quantity;
        let time = new Date().getTime();

        if (!this.cart.some((cartDto: any) => cartDto.id === optionId)) {
          if (quantity > this.currentOption.quantity) {
            quantity = this.currentOption.quantity;
          }
          if (quantity > 0) {
            this.cart.push({id: optionId, quantity: quantity, time: time});
          }
        }
        else {
          this.cart = this.cart.map((cartDto: any) => {
            if (cartDto.id === optionId) {
              cartDto.quantity = cartDto.quantity + quantity;
              if (cartDto.quantity > this.currentOption.quantity) {
                cartDto.quantity = this.currentOption.quantity;
              }
              cartDto.time = new Date().getTime();
            }
            return cartDto;
          });
        }
        sessionStorage.setItem("samanhua-shop-cart", JSON.stringify(this.cart));

        this.toastService.makeToast({
          icon: 'success',
          title: `Đã thêm ${this.book.name} (${this.currentOption.name}) vào giỏ hàng!`
        });
      }
      else {
        this.toastService.makeToast({
          icon: 'warning',
          title: `Tập truyện này đã bán hết!`
        });
      }
    }
    else {
      this.toastService.makeToast({
        icon: 'warning',
        title: `Truyện sẽ sớm được bán, bạn hãy chờ thêm nhé!`
      });
    }
  }

  onQuantityChange($event: Event) {
    let target = $event.target as HTMLInputElement;
    if (!isNaN(parseInt(target.value))) {
      target.value = `${parseInt(target.value)}`;
      this.quantity = parseInt(target.value);
    } else {
      this.quantity = 1;
      this.toastService.makeToast({
        icon: 'warning',
        title: 'Bạn cần nhập số lượng hợp lệ!'
      });
    }
    if (this.quantity > this.currentOption.quantity) {
      this.quantity = this.currentOption.quantity;
      this.toastService.makeToast({
        icon: 'warning',
        title: 'Số lượng vượt quá tối đa cho phép!'
      });
    }
    else if (this.quantity < 1) {
      this.quantity = 1;
      this.toastService.makeToast({
        icon: 'warning',
        title: 'Số lượng cần lớn hơn 0!'
      });
    }
  }

  onChangeImage($event: MouseEvent) {
    let target = $event.target as HTMLImageElement;
    this.book.image = target.src;
  }
}
