import { Component,ElementRef,ViewChild, OnDestroy} from '@angular/core';
import { AppComponent } from '../app.component';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { LoginModalService } from '../login-modal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showLoginModal = false;
  private subscription: Subscription;

  @ViewChild('loginModal') loginModal: ElementRef | undefined;
  activeTab: 'login' | 'register' = 'login';
  passwordModel: any;
  emailModel: any;
  password: any;
  email: any;
  constructor(public appComponent: AppComponent,private authService: AuthService,private snackBar: MatSnackBar,public loginModalService: LoginModalService) {
    this.subscription = this.loginModalService.showModal$.subscribe(show => {
      this.showLoginModal = show;
    });
  };

  // login(email: string, password: string) {
  //   const user = { usr: email, pwd: password };
  //   console.log(user)
  //   this.authService.login(user).subscribe(response => {
  //     console.log(response);
  //     if (response.status === "success") {
  //       this.snackBar.open("Login successful.", "Close", {
  //         duration: 5000,
  //         verticalPosition: 'top',
  //         horizontalPosition: 'center'
  //       });
  //       this.appComponent.isLoggedIn = true;
  //       // 在这里处理登录成功后的逻辑，例如跳转到其他页面
  //     } else {
  //       this.snackBar.open("Login failed: " + response.message, "Close", {
  //         duration: 5000,
  //         verticalPosition: 'top',
  //         horizontalPosition: 'center'
  //       });
  //     }
  //   });
  //   this.loginModalService.toggleModal();
  //   this.email = '';
  //   this.password = '';
  // };
  //
  // switchTab(tab: 'login' | 'register') {
  //   this.activeTab = tab;
  // };
  // register(email: string, password: string) {
  //   const user = { usr:  email, pwd:  password };
  //   console.log(user)
  //   this.authService.signIn(user).subscribe(response => {
  //     console.log(response);
  //     if (response.status === "success") {
  //       this.snackBar.open("User registered successfully.", "Close", {
  //         duration: 5000,
  //         verticalPosition: 'top',
  //         horizontalPosition: 'center',
  //       });
  //     } else {
  //       this.snackBar.open(response.message, "Close", {
  //         duration: 5000,
  //         verticalPosition: 'top',
  //         horizontalPosition: 'center'
  //       });
  //     }
  //     });
  //   this.loginModalService.toggleModal();
  //   this.emailModel = '';
  //   this.passwordModel = '';
  // };

  toggleLoginModal() {
    this.loginModalService.toggleModal();
  }

}
