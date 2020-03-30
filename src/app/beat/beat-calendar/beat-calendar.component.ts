import { Component, OnInit, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { UserService } from 'src/app/user/service/user.service';
import { UserData } from 'src/app/user/model/user-model';
import { BeatService } from '../service/beat.service';
import { MatDialog } from '@angular/material';
import { EditCalendarComponent } from './modal/edit-calendar/edit-calendar.component';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { AddCalendarComponent } from './modal/add-calendar/add-calendar.component';


@Component({
  selector: 'beat-calendar',
  templateUrl: './beat-calendar.component.html',
  styleUrls: ['./beat-calendar.component.scss']
})
export class BeatCalendarComponent implements OnInit, AfterViewInit {

  loader: boolean = false;
  currentUser: any;
  users: UserData[];
  calendar: boolean = false;
  schedules: any;
  beats: any;
  searchText: string = '';
  month: number = new Date().getMonth();
  year: number = new Date().getFullYear();
  months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  constructor(private _user: UserService, private _beat: BeatService, public dialog: MatDialog, private el: ElementRef,
    private renderer: Renderer2) { }

  //Get Schedules of next Month.
  nextMonth() {
    this.month = (this.month + 1) % 12;
    if (this.month === 0) this.year++;
    this.getSchedules(this.currentUser);
  }

  //Get Schedules of Previous Month.
  previousMonth() {
    this.month = (this.month - 1) % 12;
    if (this.month === -1) {
      this.month = 11;
      this.year--;
    }
    this.getSchedules(this.currentUser);
  }

  //open Add new calender modal
  addSchedule(): void {
    const dialogRef = this.dialog.open(AddCalendarComponent, {
      width: '450px',
      data: { beats: this.beats, user: this.currentUser }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) this.getSchedules(this.currentUser);

    });
  }//edit Schedule ends.

  //Get Schedules.
  getSchedules(user) {
    this.loader = true;
    this.currentUser = user; this.beats = [];
    this._beat.getBeats({ division: user.division, sales_office: user.sales_office, gtm_city: user.gtm_city, dc: user.dc, name: [], active: true }).subscribe(
      res => { this.beats = res; },
      err => {
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
      }
    );
    this.schedules = []; this.calendar = true;
    this._beat.getSchedule({ month: this.month, year: this.year, user: user.loginid }).subscribe(
      res => {
        this.schedules = res;
        this.loader = false;
        this.schedules.forEach((schedule: any, i: number) => {
          setTimeout(() => {
            schedule.isShowing = true;
          }, 100 * i);
        });
      },
      err => {
        this.loader = false;
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
      }
    );
  }//getSchedules.

  //open edit calender modal
  editSchedule(schedule): void {
    const dialogRef = this.dialog.open(EditCalendarComponent, {
      width: '450px',
      data: { schedule, beats: this.beats }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) this.getSchedules(this.currentUser);

    });
  }//edit Schedule ends.

  //Refresh.
  refresh() {
    this.getSchedules(this.currentUser);
  }

  ngOnInit() {

    this._user.getUsers({ division: [], sales_office: [], gtm_city: [], dc: [], active: true }).subscribe(
      (res: any) => { this.users = res },
      err => {
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
      }
    );//getUsers.

  }//ngOnInit.

  ngAfterViewInit() {

  }

}//Class.

