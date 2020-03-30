import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DistributorData } from '../model/distributor-model';


@Injectable({
  providedIn: 'root'
})
export class DistributorService {

  private baseUrl: string = environment.uri

  constructor(private http: HttpClient) { }

  addDistributor(distributor) {
    return this.http.post<any>(`${this.baseUrl}/distributor/add`, distributor)
  }

  activateDistributor(state) {
    return this.http.post<any>(`${this.baseUrl}/distributor/active`, state)
  }

  getDistributors(query): Observable<DistributorData> {
    return this.http.post<any>(`${this.baseUrl}/distributor`, query).pipe(
      map(res => res.distributors))
  }

  removeDistributorMapping(distributors) {
    return this.http.post<any>(`${this.baseUrl}/counter/removeDistributorMapping`, distributors)
  }

  uploadDistributors(distributors) {
    return this.http.post<any>(`${this.baseUrl}/distributor/bulkAdd`, distributors, { reportProgress: true, observe: 'events' })
  }

}
