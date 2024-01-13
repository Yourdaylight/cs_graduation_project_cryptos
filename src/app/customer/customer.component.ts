import { Component, OnInit } from '@angular/core';
import {LoginModalService} from "../login-modal.service";
import {AuthService} from "../auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import { Router } from '@angular/router';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {
  username = 'JohnDoe'; // 模拟用户名
  currentDate = new Date().toLocaleDateString();
  ipAddress = '127.0.0.1'; // 模拟 IP 地址
  browserLanguage = navigator.language || 'en-US';
  isChangePasswordVisible = false;
  newPassword = '';
  confirmNewPassword = '';

  constructor(private router: Router,private snackBar: MatSnackBar,private authService: AuthService,public loginModalService: LoginModalService) {  };

  ngOnInit(): void {
    this.username = this.loginModalService.uname
  }

  openChangePasswordModal(): void {
    this.isChangePasswordVisible = true;
  }

  cancelChangePassword(): void {
    this.isChangePasswordVisible = false;
    this.newPassword = '';
    this.confirmNewPassword = '';
  }

  changePassword(): void {
    const user={usr:this.username,pwd:this.newPassword}
    console.log(user)
    this.isChangePasswordVisible = false;
    this.newPassword = '';
    this.confirmNewPassword = '';
    this.authService.modify(user).subscribe(response => {
      console.log(response);
      if (response.status === "success") {
        this.snackBar.open("Modify successful.", "Close", {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      } else {
        this.snackBar.open("Modify failed: " + response.message, "Close", {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }
    });
  }
  deleteuser(): void {
    const user={usr:this.username}
    console.log(user)
    this.isChangePasswordVisible = false;
    this.newPassword = '';
    this.confirmNewPassword = '';
    this.authService.delete(user).subscribe(response => {
      console.log(response);
      if (response.status === "success") {
        this.snackBar.open("Delete successful.", "Close", {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.router.navigate(['/']).then(() => {
          // 任何在导航完成后需要执行的操作
          window.location.reload();
        });
      } else {
        this.snackBar.open("Delete failed: " + response.message, "Close", {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }

    });
  }
}
