import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post} from './tieba/tieba.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  posts: Post[] = [];
  getPostByTitle(title: string): Post | undefined {
    console.log(this.posts)
    return this.posts.find((post) => post.title === title);
  }
  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) { }

  signIn(user: { usr: string, pwd: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signin`, user);
  }

  login(user: { usr: string, pwd: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user);
  }

  modify(user: { usr: string, pwd: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/modify`, user);
  }
  delete(user: { usr: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/dele`, user);
  }

  getCardDetails(id: string | null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/card-details/${id}`);
  }

  getdialog(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dialog`);
  }
  getcrypto(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/market`);
  }

  getprice(coinname:{coin:string}):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/cryptos`,coinname);
  }

  uploadpost(post:{title: string,content: string,date: Date,summary: string,likes: number,comments: Array<{ username: string; comment: string }>}):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/uploadpost`,post);
  }
  getposts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getposts`);
  }

  updatePostLikes(posttitle: string, newLikes: number) {
    const body = { title:posttitle,likes: newLikes };
    return this.http.post(`${this.apiUrl}/updatelikes`,body);
  }
  updatecomments(posttitle: string, comments: Array<any>) {
    const body = { title:posttitle,comments: comments };
    return this.http.post(`${this.apiUrl}/updatecomments`,body);
  }

  fetchData(url: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/fetch_data`, { url: url });
  }
  fetchData2(url: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/fetch_data2`, { url: url });
  }
  predict(coin: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/predict`, { coin: coin });
  }
}
