import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { ForumComponent } from './forum/forum.component';
import { CustomerComponent } from './customer/customer.component';
import { CardDetailsComponent } from './card-details/card-details.component';
import {ChatComponent} from "./chat/chat.component";
import {CryptoComponent} from "./crypto/crypto.component";
import {TiebaComponent} from "./tieba/tieba.component";
import {PostDetailsComponent} from "./post-details/post-details.component";
import {CryptoDetailsComponent} from "./crypto-details/crypto-details.component";



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'news', component: NewsComponent },
  { path: 'forum', component: ForumComponent },
  { path: 'customer', component: CustomerComponent },
  { path: 'card-details/:id', component: CardDetailsComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'crypto', component: CryptoComponent },
  { path: 'community', component: TiebaComponent },
  { path: 'post/:title', component: PostDetailsComponent },
  { path: 'crypto-details/:ccy', component: CryptoDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
