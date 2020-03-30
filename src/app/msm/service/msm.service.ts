import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MsmService {

  private baseUrl: string = environment.uri

  constructor(private http: HttpClient) { }

  getMsms(query) {
    return this.http.post<any>(`${this.baseUrl}/msm`, query).pipe(
      map(res => res.msms)
    );
  }

  downloadFormat(query) {
    return this.http.post<any>(`${this.baseUrl}/msm/downloadFormat`, query).pipe(
      map(res => res.msms)
    );
  }

  uploadMsms(msms) {
    return this.http.post<any>(`${this.baseUrl}/msm/bulkAdd`, msms, { reportProgress: true, observe: 'events' })
  }

} 
