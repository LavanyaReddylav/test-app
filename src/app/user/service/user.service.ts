import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserData } from '../model/user-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = environment.uri

  constructor(private http: HttpClient) { }

  getLasmReport(query) {
    return this.http.post<any>(`${this.baseUrl}/dws/lasm-report`, query).pipe(
      map(res => res.report)
    );
  }

  getUsers(query): Observable<UserData> {
    return this.http.post<any>(`${this.baseUrl}/user`, query).pipe(
      map(res => res.users)
    );
  }

  activateUser(state) {
    return this.http.post<any>(`${this.baseUrl}/user/active`, state)
  }

  uploadUsers(users) {
    return this.http.post<any>(`${this.baseUrl}/user/bulkAdd`, users, { reportProgress: true, observe: 'events' })
  }

  EditUser(user) {
    return this.http.post<any>(`${this.baseUrl}/user/modify`, { user })
  }

  getTicket(query) {
    return this.http.post<any>(`${this.baseUrl}/ticket/`, query).pipe(
      map(res => res.tickets)
    );
  }

  modifyTicket(ticket) {
    return this.http.post<any>(`${this.baseUrl}/ticket/status`, ticket)

  }

}
