import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {UserSidebarComponent} from "../../../components/user-sidebar/user-sidebar.component";
import {UserService} from "../../../services/user.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {map, of, switchMap} from "rxjs";
import {FileService} from "../../../services/file.service";
import {NgForOf} from "@angular/common";
import {AddressService} from "../../../services/address.service";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-edit-info',
  standalone: true,
  imports: [RouterLink, UserSidebarComponent, NgForOf, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-info.component.html',
  styles: ``
})
export class EditInfoComponent implements OnInit {
  customerId!: number;
  user: any;
  image: any;
  fullName: any;
  phone: any;
  gender!: string;
  birthday!: string;
  isUploaded: boolean = true;

  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];

  province: string = "";
  district: string = "";
  ward: string = "";

  constructor(private userService: UserService, private fileService: FileService, private router: Router, private addressService: AddressService, private toastService: ToastService) {
  }

  ngOnInit(): void {
    let item = localStorage.getItem("samanhua-shop-current-user");
    if (item) {
      let parse: any = JSON.parse(item);
      this.customerId = parse.id;
      this.userService.getUserById(this.customerId).subscribe((user: any) => {
        this.user = user;
        this.image = user.image;
        this.fullName = user.name;
        this.phone = user.phone;
        this.birthday = user.birthday;
        this.gender = user.gender;
        this.addressService.getProvinces().subscribe((provinces: any[]) => {
          this.provinces = provinces;
          if (user.ward) {
            let province = this.user.ward.district.province.code;
            this.province = `${province}`;
            this.addressService.getDistricts(province).pipe(
              switchMap((districts: any[]) => {
                this.districts = districts;
                let district = this.user.ward.district.code;
                this.district = `${district}`;
                return this.addressService.getWards(district);
              })
            ).subscribe((wards: any[]) => {
              this.wards = wards;
              this.ward = `${this.user.ward.code}`;
            })
          }
        })
      });
    }
  }

  onChangeImage($event: Event) {
    let target = $event.target as HTMLInputElement;
    if (target.files) {
      let files = target.files;
      if (files.length != 0) {
        let file = files[0];

        let reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target) {
            this.image = e.target.result as string;
            this.isUploaded = false;
          }
        }

        reader.readAsDataURL(file);
      }
    }
  }

  onUpdateCustomer() {
    of(this.isUploaded)
      .pipe(switchMap((b: boolean) => b ? of(this.image.substring(33)) : this.fileService.upload(this.image).pipe(map((image: any) => image.url))))
      .subscribe((image: string) => {
        let c: any = {
          name: this.fullName,
          gender: this.gender,
          image,
          phone: this.phone,
          birthday: this.birthday
        }

        if (this.ward) {
          c.ward = parseInt(this.ward);
        }

        console.log(c);

        this.userService.updateCustomer(this.customerId, c).subscribe({
          next: () => {
            this.toastService.makeToast({
              icon: "success",
              title: "Cập nhật thông tin thành công!"
            })
            this.router.navigate(['/user']);
          },
          error: () => {
            this.toastService.makeToast({
              icon: "error",
              title: "Có lỗi xảy ra"
            })
          }
        });
      });
  }

  onProvinceChange($event: Event) {
    let target = $event.target as HTMLSelectElement;
    let value = target.value;
    if (value !== "") {
      this.addressService.getDistricts(value).subscribe((districts: any) => {
        this.districts = districts;
      });
    } else {
      this.districts = [];
    }
    this.district = "";
    this.ward = "";
  }

  onDistrictChange($event: Event) {
    let target = $event.target as HTMLSelectElement;
    let value = target.value;
    if (value !== "") {
      this.addressService.getWards(value).subscribe((wards: any[]) => {
        this.wards = wards;
      });
    } else {
      this.wards = [];
    }
    this.ward = "";
  }

}
