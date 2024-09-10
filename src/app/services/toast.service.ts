import { Injectable } from '@angular/core';
import {SweetAlertOptions} from "sweetalert2";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toast: BehaviorSubject<SweetAlertOptions> = new BehaviorSubject<any>(null);
  toastObservable: Observable<SweetAlertOptions> = this.toast.asObservable();

  constructor() { }

  makeToast(toast: SweetAlertOptions) {
    this.toast.next(toast);
  }
}
