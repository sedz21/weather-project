import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserRegistrationService {
  private apiUrl = 'http://localhost:5001';

  constructor(private http: HttpClient) {}

  signUp(username: string, email: string, password: string): Observable<any>{
    const userData = {username, email, password};
    const serverUrl = this.apiUrl + '/signup';
    return this.http.post(serverUrl, userData);
  }

  logIn(username: string, password: string){
    const serverUrl = this.apiUrl + '/login';
    return this.http.post(serverUrl, {username, password});
  }

}
