import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  createPayment(orderId: number): Observable<any> {
    return this.http.get<any>("https://api.ipify.org?format=json").pipe(
      map((value: any) => {
        return {idAddress: value.ip};
      }),
      switchMap((value: any) => {
        return this.http.post<any>("http://localhost:8080/api/v1/payment/create-payment", {...value, orderId});
      })
    );
  }
}
