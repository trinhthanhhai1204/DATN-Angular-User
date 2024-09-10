import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  onLogin(login: any): Observable<any> {
    return this.http.post<any>("http://localhost:8080/api/v1/auth/authenticate", login);
  }

  onRegister(register: any): Observable<any> {
    return this.http.post<any>("http://localhost:8080/api/v1/auth/register", register);
  }

  changePassword(changePassword: any): Observable<any> {
    return this.http.post<any>("http://localhost:8080/api/v1/auth/change-password", changePassword, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("samanhua-shop-user-token")}`
      }
    })
  }
}
