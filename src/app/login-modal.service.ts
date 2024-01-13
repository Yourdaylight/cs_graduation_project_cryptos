import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginModalService {
  private showModalSubject = new BehaviorSubject<boolean>(false);
  showModal$ = this.showModalSubject.asObservable();

  // toggleModal(value?: boolean): void {
  //   this.showModalSubject.next(value === undefined ? !this.showModalSubject.getValue() : value);
  // }
  toggleModal(): void {
    const currentValue = this.showModalSubject.getValue();
    this.showModalSubject.next(!currentValue);
  }


  private _uname: string = '';
  get uname(): string {
    return this._uname;
  }

  set uname(value: string) {
    this._uname = value;
  }
}
