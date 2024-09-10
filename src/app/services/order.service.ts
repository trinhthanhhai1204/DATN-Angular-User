import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  getOrderStatusList(): Observable<any[]> {
    return this.http.get<any[]>("http://localhost:8080/api/v1/admin/all-order-status")
  }

  getOrderByCustomerId(id: number, status: string, page: number, size: number, sort: number): Observable<any[]> {
    let init = `http://localhost:8080/api/v2/orders/by-customer/${id}` + (status !== "" ? `/by-status/${status}` : "");
    let query = [];
    if (page !== 0) {
      query.push(`page=${page}`);
    }
    query.push(`size=${size}`);
    switch (sort) {
      case 2:
        query.push("sort=order_created_at,asc");
        break;
      default:
        query.push("sort=order_created_at,desc");
        break;
    }
    return this.http.get<any[]>(init + "?" + query.join("&")).pipe(
      map((orders: any[]) => orders.map((order: any) => {
        order.orderDetails.sort((a: any, b: any) => a.option.id - b.option.id)
        return order;
      })),
      map((orders: any[]) => orders.map(order => {
        order.orderDetails = order.orderDetails.map((orderDetail: any) => {
          orderDetail.option.book.image = `http://localhost:8080/api/v1/file${orderDetail.option.book.image}`;
          return orderDetail;
        });
        return order;
      }))
    );
  }

  getCountByCustomerId(customerId: number, status: string) {
    return this.http.get<number>(`http://localhost:8080/api/v2/orders/count/by-customer/${customerId}` + (status !== "" ? `/by-status/${status}` : ""));
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/v2/orders/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("samanhua-shop-user-token")}`
      }
    }).pipe(
      map((order: any) => {
        order.orderDetails = order.orderDetails.map((orderDetail: any) => {
          orderDetail.option.book.image = `http://localhost:8080/api/v1/file${orderDetail.option.book.image}`;
          return orderDetail;
        }).sort((a: any, b: any) => a.option.id - b.option.id);
        order.orderLogs = order.orderLogs.sort((a: any, b: any) => a.id - b.id);
        return order;
      })
    );
  }

  saveOrder(o: any): Observable<number> {
    return this.http.post<number>(`http://localhost:8080/api/v1/orders`, o, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("samanhua-shop-user-token")}`
      }
    });
  }

  updateOrderStatus(orderId: number, status: number): Observable<any> {
    return this.http.put(`http://localhost:8080/api/v2/orders/by-status/${orderId}?status=${status}`, null);
  }
}
