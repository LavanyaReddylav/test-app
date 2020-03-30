import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AttendanceReportData } from 'src/app/attendance/model/attendanceReport.model';


@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private baseUrl: string = environment.uri

  constructor(private http: HttpClient) { }

  getAttendances(query): Observable<AttendanceReportData> {
    return this.http.post<any>(`${this.baseUrl}/attendance/getReport`, query).pipe(
      map(res => res.attendances)
    );
  }

  getTravelAllowances(form) {
    return this.http.post(`${this.baseUrl}/travel-allowance/report`, form, { reportProgress: true, observe: 'events', responseType: 'blob' })
  }

  getHrReport(form) {
    return this.http.post(`${this.baseUrl}/travel-allowance/hr-report`, form, { reportProgress: true, observe: 'events', responseType: 'blob' })
  }


  getSummary(query) {
    return this.http.post<any>(`${this.baseUrl}/attendance/summary`, query).pipe(
      map(res => res.users)
    );
  }
}
