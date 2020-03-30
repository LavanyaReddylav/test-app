import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class EkycService {

  private baseUrl: string = environment.uri

  constructor(private http: HttpClient) { }

  getDownloadReport(query) {
    return this.http.post<any>(`${this.baseUrl}/counter/download`, query).pipe(
      map(res => res.link)
    );
  }

}
