import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>("http://localhost:8080/api/v2/categories/all");
  }

  getFeaturedCategories(): Observable<any[]> {
    return this.http.get<any[]>("http://localhost:8080/api/v2/categories?size=4").pipe(
      map((categories: any[]) => categories.map((category: any) => {
          category.image = `http://localhost:8080/api/v1/file${category.image}`;
          return category;
        }))
    );
  }

  getCategoriesByBook(bookId: number) : Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v2/categories/by-book/${bookId}`);
  }
}
