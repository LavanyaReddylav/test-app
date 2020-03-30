import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CounterData } from '../model/counter-model';

@Injectable({
  providedIn: 'root'
})
export class CounterService {

  private baseUrl: string = environment.uri
  private dataSource = new BehaviorSubject<CounterData>(null);
  currentData = this.dataSource.asObservable();

  constructor(private http: HttpClient) { }

  addCounter(counter) {
    return this.http.post<any>(`${this.baseUrl}/counter/add`, counter)
  }

  addMSM(msm) {
    return this.http.post<any>(`${this.baseUrl}/msm/add`, msm)
  }

  activateCounter(state) {
    return this.http.post<any>(`${this.baseUrl}/counter/active`, state)
  }

  getCounters(query): Observable<CounterData> {
    return this.http.post<any>(`${this.baseUrl}/counter`, query).pipe(
      map(res => res.counters)
    );
  }

  mapDistributor(body) {
    return this.http.put<any>(`${this.baseUrl}/counter/distributorMapping`, body)
  }

  removeBeatMapping(counters) {
    return this.http.post<any>(`${this.baseUrl}/beat/removeCounterMapping`, counters)
  }


  uploadCounters(counters) {
    return this.http.post<any>(`${this.baseUrl}/counter/bulkAdd`, counters, { reportProgress: true, observe: 'events' })
  }

  uploadBeatMapping(beatCounterMapping) {
    return this.http.put(`${this.baseUrl}/beat/bulkCounterMapping`, beatCounterMapping, { reportProgress: true, observe: 'events' })
  }

  uploadDistributorMapping(distributorCounterMapping) {
    return this.http.put(`${this.baseUrl}/counter/bulkDistributorMapping`, distributorCounterMapping, { reportProgress: true, observe: 'events' })
  }

  downloadFormatUomid(form) {
    return this.http.post<any>(`${this.baseUrl}/counter/uomid-download-format`, form).pipe(map(res => res.counters))
  }

  uploadUomidsMapping(form) {
    return this.http.post<any>(`${this.baseUrl}/counter/uomid-store-code`, form, { reportProgress: true, observe: 'events' })
  }
}
