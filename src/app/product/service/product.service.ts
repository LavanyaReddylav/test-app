import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl: string = environment.uri

  constructor(private http: HttpClient) { }

  // : Observable<UserData> 
  getProducts(query) {
    return this.http.post<any>(`${this.baseUrl}/product`, query).pipe(
      map(res => res.products)
    )
  }

  uploadProducts(products) {
    return this.http.post<any>(`${this.baseUrl}/product/add`, products, { reportProgress: true, observe: 'events' })
  }

  getDivisions() {
    return this.http.post<any>(`${this.baseUrl}/product/division`, { divisions: [] }).pipe(
      map(res => res.result)
    )
  }

}
