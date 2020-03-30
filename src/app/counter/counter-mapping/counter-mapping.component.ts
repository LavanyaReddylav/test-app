import { Component, OnInit } from '@angular/core';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { CounterService } from '../service/counter.service';
import { ExcelService } from 'src/app/shared/service/excel.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'counter-mapping',
  templateUrl: './counter-mapping.component.html',
  styleUrls: ['./counter-mapping.component.scss']
})
export class CounterMappingComponent implements OnInit {

  baseUrl: string = environment.uri;

  uploadBeatForm: FormData;
  uploadDistributorForm: FormData;
  beatMappingFile: File;
  distributorMappingFile: File;
  error1: any;
  error2: any;
  beatMappingDownloadFormat: boolean = false;
  distributorMappingDownloadFormat: boolean = false;
  progressValue1: number = 0;
  progressValue2: number = 0;

  constructor(public dialog: MatDialog, private fb: FormBuilder, private _counter: CounterService, private excel: ExcelService) { }

  //Download format fot beat counter mapping. 
  beatDownloadFormat() {
    this.beatMappingDownloadFormat = true;
  }

  //Download format for distributor Counter mapping
  distributorDownloadFormat() {
    this.distributorMappingDownloadFormat = true;
  }

  //upload beat counter mapping
  beatCounterMapping(beatMappingFile: File) {
    this.uploadBeatForm = new FormData();
    this.uploadBeatForm.append('excel', beatMappingFile);
    this._counter.uploadBeatMapping(this.uploadBeatForm).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressValue1 = (event.loaded / event.total) * 100;
            break;
          case HttpEventType.Response:
            this.dialog.open(SuccessComponent, {
              width: '550px',
              data: { title: 'Success!', content: `Counters Mapped with Beats Successfully.` }
            })
        }//switch case.
      },//event ends.
      err => {
        this.error1 = err;
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
      }//err ends.
    )
  };// uploadEvent ends

  //upload distributor counter mapping
  distributorCounterMapping(distributorMappingFile: File) {
    this.uploadDistributorForm = new FormData();
    this.uploadDistributorForm.append('excel', distributorMappingFile);
    this._counter.uploadDistributorMapping(this.uploadDistributorForm).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressValue2 = (event.loaded / event.total) * 100;
            break;
          case HttpEventType.Response:
            this.dialog.open(SuccessComponent, {
              width: '550px',
              data: { title: 'Success!', content: `Counters Mapped With Distributors Successfully.` }
            })
        }//switch case.
      },//event ends.
      err => {
        this.error2 = err;
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
      });//err  subscribe ends.
  };// uploadEvent ends

  selectBeatMappingEvent(file: File): void {
    this.progressValue1 = 0;
  }

  cancelBeatMappingEvent(): void {
    this.progressValue1 = 0;
  }

  selectDistributorMappingEvent(file: File): void {
    this.progressValue2 = 0;
  }

  cancelDistributorMappingEvent(): void {
    this.progressValue2 = 0;
  }

  ngOnInit() {
  }

}
