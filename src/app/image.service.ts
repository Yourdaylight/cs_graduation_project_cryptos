import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private unsplashUrl = 'https://api.unsplash.com/photos/random';

  constructor(private http: HttpClient) {}

  getRandomImage(query: string): Observable<any> {
    const params = {
      client_id: environment.unsplashAccessKey,
      orientation:'landscape',
      count:1,
      query,
    };

    return this.http.get(this.unsplashUrl, { params });
  }
}
