import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SalesData } from '../model/sale.model';


@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private baseUrl: string = environment.uri

  constructor(private http: HttpClient) { }


  getSales(query): Observable<SalesData> {
    return this.http.post<any>(`${this.baseUrl}/sale`, query).pipe(
      map(res => res.sales)
    );
  }

  sendMailers(query): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sale/mailers`, query)
  }

}
