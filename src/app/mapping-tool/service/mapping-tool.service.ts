import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DistributorData } from '../../distributor/model/distributor-model';
import { map } from 'rxjs/operators';
import { UserData } from '../../user/model/user-model';
import { BeatData } from '../../beat/model/beat-model';

@Injectable({
  providedIn: 'root'
})
export class MappingToolService {

  private baseUrl: string = environment.uri

  constructor(private http: HttpClient) { }

  //Get Distributors.
  getDistributors(query, projection): Observable<DistributorData> {
    return this.http.post<any>(`${this.baseUrl}/distributor`, { ...query, projection }).pipe(
      map(res => res.distributors))
  }

  //Get Divisions.
  getDivision(query): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/mapping-tool/division`, query).pipe(
      map(res => res.divisions))
  }

  //Get Users.
  getUsers(query, projection): Observable<UserData> {
    return this.http.post<any>(`${this.baseUrl}/user`, { ...query, projection }).pipe(
      map(res => res.users)
    );
  }

  //Get Beats.
  getBeats(query, projection): Observable<BeatData> {
    return this.http.post<any>(`${this.baseUrl}/beat`, { ...query, mode: '', projection }).pipe(
      map(res => res.beats)
    );
  }

  //Get Counters.
  getCounters(query, projection): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/mapping-tool/counter`, { ...query, projection }).pipe(
      map(res => res.counters)
    );
  }

  //Get Beat Schedules' Dates For a User & Beat.
  getUsersBeatDates(user, beat, month): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/mapping-tool/getDatesFromBeat`, { user, beat, month }).pipe(
      map(res => res.dates)
    );
  }

  //Get Scheduled Beats For a User.
  getBeatsForUser(user): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/mapping-tool/getBeatsForUser`, { user }).pipe(
      map(res => res.beats)
    );
  }

  //Get LASM Complete Mapping Data.
  getUserMapping(query) {
    return this.http.post<any>(`${this.baseUrl}/mapping-tool/getUserMapping`, query).pipe(
      map(res => res.link)
    );
  }

  //Scan And Vallidate User Mapping File.
  scanAndValidate(query) {
    return this.http.post<any>(`${this.baseUrl}/mapping-tool/scanAndValidate`, query).pipe(
      map(res => res.link)
    );
  }

  //Beat Counter Mapping.
  beatCounterMapping(query) {
    return this.http.post<any>(`${this.baseUrl}/mapping-tool/beat-counter-mapping`, query);
  }

  //Beat User Mapping.
  beatUserMapping(query) {
    return this.http.post<any>(`${this.baseUrl}/mapping-tool/beat-user-mapping`, query);
  }


}
