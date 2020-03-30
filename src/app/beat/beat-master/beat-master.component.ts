import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AddbeatComponent } from './modal/addbeat/addbeat.component';
import { BeatService } from '../service/beat.service';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { ExcelService } from 'src/app/shared/service/excel.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'beat-master',
  templateUrl: './beat-master.component.html',
  styleUrls: ['./beat-master.component.scss'],
})
export class BeatMasterComponent implements OnInit {

  baseUrl: string = environment.uri;

  filterForm: FormGroup;
  beats;
  showTable: boolean = false;
  showUpload: boolean = false;
  file: File;
  uploadForm: FormData;
  error: any;
  DownloadFormat: boolean = false;
  progressValue: number = 0;

  //selected options for the filter
  division: string[];
  sales_office: string[];
  gtm_city: string[];
  dcList: string[];
  beatStatus: BeatStatus[] = [{ value: '', viewValue: 'All' }, { value: true, viewValue: 'Active' }, { value: false, viewValue: 'InActive' }];
  // beatStatus:

  constructor(public dialog: MatDialog, private fb: FormBuilder, private _beat: BeatService, private excel: ExcelService) { }

  //Download format.
  downloadFormat() {
    this.DownloadFormat = true;
  }

  // Toggle All Selection.
  toggleAllSelection(selected, formControlName) {
    if (selected) {
      switch (formControlName) {
        case 'sales_office':
          this.filterForm.controls[formControlName].patchValue(this[formControlName]);
          break;
        case 'gtm_city':
          this.filterForm.controls[formControlName].patchValue(this[formControlName].map(i => i.name));
          break;
        case 'division':
          this.filterForm.controls[formControlName].patchValue(this[formControlName].map(i => i.dvcode));
      }

    }
    else {
      this.filterForm.controls[formControlName].patchValue([]);
    }
  }

  uploadEvent(file: File) {
    this.uploadForm = new FormData();
    this.uploadForm.append('excel', file);
    this._beat.uploadBeats(this.uploadForm).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressValue = (event.loaded / event.total) * 100;
            break;
          case HttpEventType.Response:
            this.dialog.open(SuccessComponent, {
              width: '450px',
              data: { title: 'Success!', content: `Beats Uploaded Successfully.` }
            })
        }//switch case.
      },//event ends.
      err => {
        this.error = err;
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
      }) //err , subscribe ends.
  };//uploadEvent ends.

  selectEvent(file: File): void {
    this.progressValue = 0;
  }

  cancelEvent(): void {
    this.progressValue = 0;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddbeatComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  //load beats
  loadBeats() {
    this.beats = null;
    this.showTable = true;
    this._beat.getBeats(this.filterForm.value, 'export').subscribe(
      res => {
        this.beats = res;
      },
      err => {
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
        this.showTable = false;
      })
  }//load beats

  //Export Beats.
  exportAsExcel() {
    const data = this.beats.map((item: any) => {
      return {
        'Beat Name': item.name,
        'Sales Office': item.sales_office,
        'Gtm City': item.gtm_city,
        'Distribution Channel': item.dc.join(', '),
        'Division': item.division.join(', '),
        'Active': item.active,
        'Counter Code Mapping': item.counter
      }
    });
    this.excel.exportAsExcelFile(data, 'beats');
  }

  ngOnInit() {
    this.filterForm = this.fb.group({
      sales_office: [[]],
      gtm_city: [[]],
      division: [[]],
      dc: [[]],
      active: ['']
    });
    this.division = JSON.parse(localStorage.divisionList);
    this.sales_office = JSON.parse(localStorage.salesOfficeList);
    this.gtm_city = JSON.parse(localStorage.gtmCityList);
    this.dcList = JSON.parse(localStorage.dcList);
  }
}

export interface BeatStatus {
  value: boolean | string;
  viewValue: string;
}