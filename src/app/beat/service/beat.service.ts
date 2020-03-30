import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BeatData } from '../model/beat-model';

@Injectable({
  providedIn: 'root'
})
export class BeatService {

  private baseUrl: string = environment.uri

  constructor(private http: HttpClient) { }

  addBeat(beat) {
    return this.http.post<any>(`${this.baseUrl}/beat/add`, beat)
  }

  activateBeat(body) {
    return this.http.post<any>(`${this.baseUrl}/beat/active`, body)
  }

  getBeats(query, mode?): Observable<BeatData> {
    return this.http.post<any>(`${this.baseUrl}/beat`, { ...query, mode }).pipe(
      map(res => res.beats)
    );
  }

  mapBeat(body) {
    return this.http.put<any>(`${this.baseUrl}/beat/counterMapping`, body)
  }


  getSchedule(query) {
    return this.http.post<any>(`${this.baseUrl}/beatSchedule/`, query).pipe(
      map(res => res.beatSchedules.schedule)
    );
  }

  //Delete Schedule.
  deleteSchedule(scheduleId) {
    return this.http.post<any>(`${this.baseUrl}/beatSchedule/delete`, { scheduleId })
  }

  //Add New Beat Schedule.
  addSchedule(schedule) {
    return this.http.post<any>(`${this.baseUrl}/beatSchedule/add`, schedule)
  }

  //Update Beat.
  updateSchedule(body) {
    return this.http.post<any>(`${this.baseUrl}/beatSchedule/update`, body)
  }

  getSchedules(query) {
    return this.http.post<any>(`${this.baseUrl}/beatSchedule/getSchedules`, query).pipe(
      map(res => res.beatSchedules)
    );
  }

  uploadBeats(beats) {
    return this.http.post<any>(`${this.baseUrl}/beat/bulkAdd`, beats, { reportProgress: true, observe: 'events' })
  }

  uploadBeatSchedules(beatSchedules) {
    return this.http.post<any>(`${this.baseUrl}/beatSchedule/bulkAdd`, beatSchedules, { reportProgress: true, observe: 'events' })
  }
}
