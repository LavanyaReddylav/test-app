import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  private baseUrl: string = environment.uri;

  constructor(private http: HttpClient) { }


  genereteTicket(data) {
    return this.http.post(`${this.baseUrl}/ticket/new`, data);

  }
}
