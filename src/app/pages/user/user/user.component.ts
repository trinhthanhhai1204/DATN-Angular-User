import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {NgIf} from "@angular/common";
import {UserSidebarComponent} from "../../../components/user-sidebar/user-sidebar.component";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    UserSidebarComponent
  ],
  templateUrl: './user.component.html',
  styles: ``
})
export class UserComponent implements OnInit{
  user!: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user: any) => {
      this.user = user;
    });
  }
}
