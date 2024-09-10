import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {BookComponent} from "../../../components/book/book.component";
import {BookService} from "../../../services/book.service";

@Component({
  selector: 'app-index-featured-books',
  standalone: true,
  imports: [BookComponent, NgForOf],
  templateUrl: './index-featured-books.component.html',
  styles: []
})
export class IndexFeaturedBooksComponent implements OnInit {
  books: any[] = [];

  constructor(private bookService: BookService) {
  }

  ngOnInit(): void {
    this.bookService.getFeaturedBooks().subscribe((books: any[]) => {
      this.books = books;
    });
  }
}
