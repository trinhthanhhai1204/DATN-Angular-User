import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {BookComponent} from "../../../components/book/book.component";
import {BookService} from "../../../services/book.service";

@Component({
  selector: 'app-index-lasted-products',
  standalone: true,
  imports: [BookComponent, NgForOf],
  templateUrl: './index-lasted-products.component.html',
  styles: []
})
export class IndexLastedProductsComponent implements OnInit {
  books: any[] = [];

  constructor(private bookService: BookService) {
  }

  ngOnInit(): void {
    this.bookService.getLastedBooks().subscribe((books: any[]) => {
      this.books = books;
    });
  }
}
