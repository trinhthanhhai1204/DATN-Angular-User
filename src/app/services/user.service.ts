import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/v2/customers/${id}`).pipe(
      map((user: any) => {
        user.image = `http://localhost:8080/api/v1/file${user.image}`;
        return user;
      })
    )
  }

  updateCustomer(id: number, customer: any): Observable<any> {
    return this.http.put(
      `http://localhost:8080/api/v2/customers/${id}`,
      customer,
    );
  }

  getCurrentUser() : Observable<any> {
    return this.http.get<any>("http://localhost:8080/api/v1/auth/get-user", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("samanhua-shop-user-token")}`
      }
    }).pipe(
      map((user: any) => {
        user.image = `http://localhost:8080/api/v1/file${user.image}`;
        return user;
      })
    );
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>("http://localhost:8080/api/v1/auth/refresh-token",null, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("samanhua-shop-user-token")}`
      }
    }).pipe(
      map((user: any) => {
        user.image = `http://localhost:8080/api/v1/file${user.image}`;
        return user
      })
    );
  }
}
