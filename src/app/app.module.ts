import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { ForumComponent } from './forum/forum.component';
import { CustomerComponent } from './customer/customer.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CardDetailsComponent } from './card-details/card-details.component';
import { ChatComponent } from './chat/chat.component';
import { CryptoComponent } from './crypto/crypto.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { TiebaComponent } from './tieba/tieba.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { CryptoDetailsComponent } from './crypto-details/crypto-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewsComponent,
    ForumComponent,
    CustomerComponent,
    CardDetailsComponent,
    ChatComponent,
    CryptoComponent,
    TiebaComponent,
    PostDetailsComponent,
    CryptoDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule {
}
