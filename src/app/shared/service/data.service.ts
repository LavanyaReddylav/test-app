import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl: string = environment.uri

  constructor(private http: HttpClient) { }

  getGtmCities() {
    return this.http.post<any>(`${this.baseUrl}/gtmCity/`, { active: true }).pipe(map(res => res.gtm_cities));
  }

  getSalesOffices() {
    return this.http.post<any>(`${this.baseUrl}/salesOffice/`, { active: true }).pipe(map(res => res.sales_offices.map(item => item.name)));
  }

  getDivision() {
    return this.http.post<any>(`${this.baseUrl}/product/division`, { divisions: [] }).pipe(map(res => res.result.division));
  }//getDivision ends here.

  getDC() {
    return this.http.get<any>(`${this.baseUrl}/dc/`).pipe(map(res => res.dcs));
  }//getDivision ends here.

}//class ends here.
