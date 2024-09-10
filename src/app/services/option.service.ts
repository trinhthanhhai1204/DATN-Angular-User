import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OptionService {

  constructor(private http: HttpClient) { }

  getOptionByBookId(bookId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v2/options/by-book/${bookId}`).pipe(
      map((options: any[]) => options.map((option: any) => {
          option.image = `http://localhost:8080/api/v1/file${option.image}`
          return option;
        }))
    );
  }
}
