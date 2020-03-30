import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.uri

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog) { }

  login(user) {
    return this.http.post<any>(`${this.baseUrl}/user/signin`, user)
  }

  addUser(user) {
    return this.http.post<any>(`${this.baseUrl}/user/signup`, user)
  }

  loggedIn() {
    return !!localStorage.token
  }

  changePassword(user) {
    return this.http.put<any>(`${this.baseUrl}/user/changePassword`, user)
  }

  resetPassword(user) {
    return this.http.post<any>(`${this.baseUrl}/user/resetPassword`, user)
  }
}
