import {Component, Input} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {VNDCurrencyPipe} from "../../pipes/vnd-currency.pipe";

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    VNDCurrencyPipe
  ],
  templateUrl: './book.component.html',
  styles: []
})
export class BookComponent {
  @Input() book!: any;
}
