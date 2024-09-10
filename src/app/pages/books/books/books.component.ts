import {Component, OnInit} from '@angular/core';
import {BookService} from "../../../services/book.service";
import {BookComponent} from "../../../components/book/book.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {CategoryService} from "../../../services/category.service";
import {ActivatedRoute} from "@angular/router";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [BookComponent, NgForOf, FormsModule, NgIf, NgClass],
  templateUrl: './books.component.html',
  styles: []
})
export class BooksComponent implements OnInit {
  books: any[] = [];
  categories: any[] = [];
  currentCategory: string = "0";
  currentSort: string = "0";
  currentPage: number = 0;
  size: number = 8;
  pages: number = 0;
  pagesSequence: number[] = [];

  constructor(
    private bookService: BookService,
    private categoryService: CategoryService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().pipe(
      switchMap((categories: any[]) => {
        this.categories = categories;
        return this.router.queryParams;
      }),
      switchMap(({categoryId}: any) => {
        this.currentCategory = categoryId ? categoryId : 0;
         return this.bookService.getCount(parseInt(this.currentCategory));
      }),
      switchMap((count: number) => {
        this.getPageAction(count);
        let sort = parseInt(this.currentSort);
        return this.bookService.getBooks(parseInt(this.currentCategory), this.currentPage, this.size, sort);
      })
    ).subscribe((books: any[]) => {
      this.books = books;
    })
  }

  onCategoryChange() {
    this.currentSort = "0";
    this.onSortChange();
    this.getPages();
  }

  onSortChange() {
    this.currentPage = 0;
    this.getBooks();
  }

  getBooks() {
    let sort = parseInt(this.currentSort);
    this.bookService.getBooks(parseInt(this.currentCategory), this.currentPage, this.size, sort).subscribe((books: any[]) => {
      this.books = books;
    });
  }

  onPrevClick() {
    this.setPage(this.currentPage - 1);
  }

  onNextClick() {
    this.setPage(this.currentPage + 1);
  }

  setPage(i: number) {
    this.currentPage = i;
    this.getBooks();
  }

  getPages() {
    this.bookService.getCount(parseInt(this.currentCategory)).subscribe((count: number) => {
      this.getPageAction(count);
    });
  }

  getPageAction(count: number) {
    this.pages = Math.ceil(count / this.size);
    let sequence: number[] = [];
    for (let i = 0; i < this.pages; i++) {
      sequence.push(i + 1);
    }
    this.pagesSequence = sequence;
  }
}
