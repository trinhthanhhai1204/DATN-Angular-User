import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) {
  }

  getLastedBooks(): Observable<any[]> {
    return this.http.get<any[]>("http://localhost:8080/api/v2/books?size=4&sort=id,desc").pipe(
      map((books: any[]) => books.map((book: any) => {
          book.image = `http://localhost:8080/api/v1/file${book.image}`;
          return book;
        }))
    );
  }

  getFeaturedBooks(): Observable<any[]> {
    return this.http.get<any[]>("http://localhost:8080/api/v2/books?size=8").pipe(
      map((books: any[]) => books.map((book: any) => {
          book.image = `http://localhost:8080/api/v1/file${book.image}`;
          return book;
        }))
    );
  }

  getBooks(category: number, page: number, size: number, sort: number): Observable<any[]> {
    let init: string = "http://localhost:8080/api/v2/books" + (category == 0 ? "" : `/by-category/${category}`);
    let query: string[] = [];
    if (page != 0) {
      query.push("page=" + page);
    }
    query.push("size=" + size);

    switch (sort) {
      case 2:
        query.push("sort=id,asc");
        break;
      case 3:
        query.push("sort=price,desc");
        break;
      case 4:
        query.push("sort=price,asc");
        break;
      default:
        query.push("sort=id,desc");
        break;
    }

    return this.http.get<any[]>(init + "?" + query.join("&")).pipe(
      map((books: any[]) => books.map((book: any) => {
          book.image = `http://localhost:8080/api/v1/file${book.image}`;
          return book;
        }))
    );
  }

  getBookById(id: number): Observable<any> {
    return this.http.get<any>("http://localhost:8080/api/v2/books/" + id).pipe(
      map((book: any) => {
        book.image = `http://localhost:8080/api/v1/file${book.image}`;
        return book;
      })
    )
  }

  getCount(categoryId: number): Observable<number> {
    return this.http.get<number>("http://localhost:8080/api/v2/books/count" + (categoryId == 0 ? "" : `/by-category/${categoryId}`));
  }

  getBookByOption(cartDto: any): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/v2/books/by-option/${cartDto.id}`)
      .pipe(map((book: any) => {
        book.image = `http://localhost:8080/api/v1/file${book.image}`;
        return {
          book: book, time: cartDto.time, quantity: cartDto.quantity
        };
      }));
  }
}
