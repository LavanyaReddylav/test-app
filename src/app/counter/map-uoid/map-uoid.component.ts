import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CounterService } from '../service/counter.service';
import { ExcelService } from 'src/app/shared/service/excel.service';
import { MatDialog } from '@angular/material';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';

@Component({
  selector: 'map-uoid',
  templateUrl: './map-uoid.component.html',
  styleUrls: ['./map-uoid.component.scss']
})
export class MapUoidComponent implements OnInit {


  filterForm: FormGroup;
  showUpload: boolean = false;
  progressValue: number = 0;
  uploadForm: FormData;
  error: any;
  DownloadFormat: boolean = false;
  showLoader: boolean = false;

  //List Values
  divisionList: string[];
  salesOfficeList: string[];
  gtmCityList: string[];
  dcList: string[] = ['rural', 'trade'];
  activeList: CounterStatus[] = [{ value: '', viewValue: 'All' }, { value: true, viewValue: 'Active' }, { value: false, viewValue: 'InActive' }];
  classList: string[] = ['A', 'B', 'C', 'D', 'E'];

  constructor(private fb: FormBuilder, private _counter: CounterService, private _excel: ExcelService, public dialog: MatDialog) { }


  //Download format.
  downloadFormat() {
    this.DownloadFormat = true;
    this.showLoader = true;
    this._counter.downloadFormatUomid(this.filterForm.value).subscribe(
      res => {
        this._excel.exportAsExcelFile(res, 'Map-UOMID');
        this.showLoader = false;
      },
      err => {
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
        this.showLoader = false;
      }// err ends.
    )
  }

  uploadEvent(file: File) {
    this.uploadForm = new FormData();
    this.uploadForm.append('excel', file);
    this._counter.uploadUomidsMapping(this.uploadForm).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressValue = (event.loaded / event.total) * 100;
            break;
          case HttpEventType.Response:
            this.dialog.open(SuccessComponent, {
              width: '550px',
              data: { title: 'Success!', content: `UOMIDs Uploaded Successfully.` }
            })
        }//switch case.
      },//event ends 
      err => {
        this.error = err;
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
      }); //err , subscriber ends.
  };//uploadEvent ends.

  selectEvent(file: File): void {
    this.progressValue = 0;
  }

  cancelEvent(): void {
    this.progressValue = 0;
  }

  ngOnInit() {
    this.filterForm = this.fb.group({
      division: [[], Validators.required],
      sales_office: [[], Validators.required],
      gtm_city: [[]],
      dc: [[]],
      active: [''],
      counter_class: [[]]
    })
    this.divisionList = JSON.parse(localStorage.divisionList);
    this.salesOfficeList = JSON.parse(localStorage.salesOfficeList);
    this.gtmCityList = JSON.parse(localStorage.gtmCityList);
  }

}
export interface CounterStatus {
  value: boolean | string;
  viewValue: string;
}
