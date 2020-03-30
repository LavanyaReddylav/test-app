import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BeatService } from '../service/beat.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { MatDialog, MatTable } from '@angular/material';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { ExcelService } from 'src/app/shared/service/excel.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'beat-schedule',
  templateUrl: './beat-schedule.component.html',
  styleUrls: ['./beat-schedule.component.scss']
})
export class BeatScheduleComponent implements OnInit {

  baseUrl: string = environment.uri;

  beatScheduleForm: FormGroup;
  showTable: boolean = false;
  showUpload: boolean = false;
  beatSchedules;
  uploadForm: FormData;
  error: any;
  DownloadFormat: boolean = false;
  progressValue: number = 0;

  //selected options for the filter
  division: string[];
  sales_office: string[];
  gtm_city: string[];

  constructor(private fb: FormBuilder, private _beat: BeatService, public dialog: MatDialog, private excel: ExcelService) { }


  //Download format.
  downloadFormat() {
    this.DownloadFormat = true;
  }

  // All
  toggleAllSelection(selected, formControlName) {
    if (selected) {
      switch (formControlName) {
        case 'sales_office':
          this.beatScheduleForm.controls[formControlName].patchValue(this[formControlName]);
          break;
        case 'gtm_city':
          this.beatScheduleForm.controls[formControlName].patchValue(this[formControlName].map(i => i.name));
          break;
        case 'division':
          this.beatScheduleForm.controls[formControlName].patchValue(this[formControlName].map(i => i.dvcode));
      }

    }
    else {
      this.beatScheduleForm.controls[formControlName].patchValue([]);
    }
  }

  uploadEvent(file: File) {
    this.uploadForm = new FormData();
    this.uploadForm.append('excel', file);
    this._beat.uploadBeatSchedules(this.uploadForm).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressValue = (event.loaded / event.total) * 100;
            break;
          case HttpEventType.Response:
            this.dialog.open(SuccessComponent, {
              width: '550px',
              data: { title: 'Success!', content: `BeatSchedules Uploaded Successfully.` }
            })
        }//switch case.
      },//event ends.
      err => {
        this.error = err;
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
      });//err ,subscriber ends.
  };// uploadEvent ends

  selectEvent(file: File): void {
    this.progressValue = 0;
  }

  cancelEvent(): void {
    this.progressValue = 0;
  }

  //load schedule
  loadBeatSchedule() {
    this.beatSchedules = null;
    this.showTable = true;
    this._beat.getSchedules(this.beatScheduleForm.value).subscribe(
      res => {
        this.beatSchedules = res;
      },
      err => {
        console.log(err);
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
        this.showTable = false;
      })

  }

  exportAsExcel() {
    const data = this.beatSchedules.map((item: any) => {
      return {
        ' User Name': item.name,
        'Loginid': item.user,
        'Beat Code': item.beat,
        'Beat Coverage Date': item.date.split('T')[0],
      }
    });
    this.excel.exportAsExcelFile(data, 'beatschedule');
  }

  ngOnInit() {
    this.beatScheduleForm = this.fb.group({
      sales_office: [[]],
      gtm_city: [[]],
      division: [[]],
      starting_date: [''],
      ending_date: ['']
    });
    this.division = JSON.parse(localStorage.divisionList);
    this.sales_office = JSON.parse(localStorage.salesOfficeList);
    this.gtm_city = JSON.parse(localStorage.gtmCityList);
  }

}
