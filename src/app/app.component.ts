import { Component, ElementRef, ViewChild } from '@angular/core';
import {LoginModalService} from "./login-modal.service";
import {AuthService} from "./auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import { Subscription } from 'rxjs';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private subscription: Subscription;
  showLoginModal: boolean | undefined;
  @ViewChild('loginModal') loginModal: ElementRef | undefined;
  activeTab: 'login' | 'register' = 'login';
  passwordModel: any;
  emailModel: any;
  password: any;
  email: any;
  constructor(private router: Router,private authService: AuthService,private snackBar: MatSnackBar,public loginModalService: LoginModalService) {
    this.subscription = this.loginModalService.showModal$.subscribe(show => {
      this.showLoginModal = show;
    });
  };
  title = 'Cryptos';
  activeSubMenu: string = ''; // 当前激活的子菜单
  hideSubMenuTimer: any; // 定时器
  isLoggedIn = false;
  showSubMenu(subMenu: string) {
    this.activeSubMenu = subMenu;
    clearTimeout(this.hideSubMenuTimer); // 清除之前的定时器
  }

  showlogin() {
    this.loginModalService.toggleModal();
  }
  hideSubMenu() {
    this.activeSubMenu = '';
  }
  logout(){
    this.router.navigate(['/']).then(() => {
      // 任何在导航完成后需要执行的操作
      window.location.reload();
    });
  }
  login(email: string, password: string) {
    const user = { usr: email, pwd: password };
    console.log(user)
    this.authService.login(user).subscribe(response => {
      console.log(response);
      if (response.status === "success") {
        this.loginModalService.uname = email
        this.snackBar.open("Login successful.", "Close", {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.isLoggedIn = true;
        // 在这里处理登录成功后的逻辑，例如跳转到其他页面
      } else {
        this.snackBar.open("Login failed: " + response.message, "Close", {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }
    });
    this.loginModalService.toggleModal();
    this.email = '';
    this.password = '';
  };

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
  };
  register(email: string, password: string) {
    const user = { usr:  email, pwd:  password };
    console.log(user)
    this.authService.signIn(user).subscribe(response => {
      console.log(response);
      if (response.status === "success") {
        this.snackBar.open("User registered successfully.", "Close", {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      } else {
        this.snackBar.open(response.message, "Close", {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }
    });
    this.loginModalService.toggleModal();
    this.emailModel = '';
    this.passwordModel = '';
  };

  toggleLoginModal() {
    this.loginModalService.toggleModal();
  }

}
