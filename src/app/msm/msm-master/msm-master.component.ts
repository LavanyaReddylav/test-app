import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MatDatepicker } from '@angular/material';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MsmService } from '../service/msm.service';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { MatDialog, ErrorStateMatcher } from '@angular/material';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { ProductService } from 'src/app/product/service/product.service';
import { ExcelService } from 'src/app/shared/service/excel.service';
import { ConfirmationComponent } from 'src/app/shared/modal/confirmation/confirmation.component';
import { AuthService } from 'src/app/authorization/auth.service';

const moment = _rollupMoment || _moment;

export class CustomDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    var formatString = 'MMMM,YYYY';
    return moment(date).format(formatString);
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'msm-master',
  templateUrl: './msm-master.component.html',
  styleUrls: ['./msm-master.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: CustomDateAdapter
    }
  ]
})
export class MsmMasterComponent implements OnInit {
  @ViewChild('picker1') picker1;
  @ViewChild('picker2') picker2;

  date = new Date();
  //Date Picker Min and Max.
  minDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  maxDate = new Date(this.date.getFullYear() + 1, this.date.getMonth() + 1, 0);

  //categories.
  category;
  subcategory1;
  subcategory2;

  error: any;
  msms;
  filterForm: FormGroup;
  uploadFilterForm: FormGroup;
  showUpload: boolean = false;
  showPanel: boolean = false;
  uploadForm: FormData;
  progressValue: number = 0;
  DownloadFormat: boolean = false;
  file: File;
  showLoader: boolean = false;
  showProgresss: boolean = false;

  //selected options for the filter
  division: string[];
  sales_office: string[];
  gtmCityList: string[];
  dcList: string[];
  msmStatus: MsmStatus[] = [{ value: '', viewValue: 'All' }, { value: true, viewValue: 'Active' }, { value: false, viewValue: 'InActive' }];


  constructor(private fb: FormBuilder, private _msm: MsmService, public dialog: MatDialog, private _product: ProductService, private _excel: ExcelService, private _auth: AuthService) { }

  month_1_Selected(params) {
    this.uploadFilterForm.get('start_date').setValue(params);
    this.filterForm.get('start_date').setValue(params);
    this.picker1.close();
  }
  month_2_Selected(params) {
    this.uploadFilterForm.get('end_date').setValue(params);
    this.filterForm.get('end_date').setValue(params);
    this.picker2.close();
  }

  //load MSM
  loadMsm() {
    this.msms = null;
    this.showPanel = true;
    this._msm.getMsms(this.filterForm.value).subscribe(
      res => {
        this.msms = res;
      },
      err => {
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
        this.showPanel = false;
      }
    );

  }

  exportMsm() {
    this._excel.exportAsExcelFile(this.msms, 'Msms Details');
  }

  // All
  toggleAllSelection(selected, formControlName) {
    if (selected) {
      switch (formControlName) {
        case 'sales_office':
          this.filterForm.controls[formControlName].patchValue(this[formControlName]);
          break;
        case 'division':
          this.filterForm.controls[formControlName].patchValue(this[formControlName].map(i => i.dvcode))
      }
    }
    else {
      this.filterForm.controls[formControlName].patchValue([]);
    }
  }

  // All
  toggleAllSelectionForm(selected, formControlName) {
    if (selected) {
      switch (formControlName) {
        case 'sales_office':
          this.uploadFilterForm.controls[formControlName].patchValue(this[formControlName]);
          break;
        case 'division':
          this.uploadFilterForm.controls[formControlName].patchValue(this[formControlName].map(i => i.dvcode));
          break;
        case 'category':
          this.uploadFilterForm.controls[formControlName].patchValue(this[formControlName].map(i => i.category));
          break;
        case 'subcategory1':
          this.uploadFilterForm.controls[formControlName].patchValue(this[formControlName].map(i => i.subcategory1));
          break;
        case 'subcategory2':
          this.uploadFilterForm.controls[formControlName].patchValue(this[formControlName].map(i => i.subcategory2))

      }
    }
    else {
      this.uploadFilterForm.controls[formControlName].patchValue([]);
    }
  }

  //Download format for MSMS.
  downloadFormat() {
    this.showProgresss = true;
    // this.showLoader = false;
    if (this.uploadFilterForm.valid) {
      this.DownloadFormat = true;
      this._msm.downloadFormat(this.uploadFilterForm.value).subscribe(
        res => {
          this._excel.exportAsExcelFile(res, 'Msms');
          this.showProgresss = false;
        },
        err => {
          this.dialog.open(FailureComponent, {
            width: '350px',
            data: { title: 'Failure!', content: `${err.error.message}` }
          });
          this.showProgresss = false;
        });//err ends.

    }
  }

  //Upload MSMS.
  uploadEvent(file: File) {
    this.uploadForm = new FormData();
    this.uploadForm.append('data', JSON.stringify(this.uploadFilterForm.value));
    this.uploadForm.append('excel', file);
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '450px',
      data: { title: 'Are you sure?', content: `This will over ride already existing MSMS.` }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value == true) {
        let password = prompt(`Please enter your password to continue.`);
        this._auth.login({ loginid: JSON.parse(localStorage.user).loginid, password }).subscribe(
          res => {
            this._msm.uploadMsms(this.uploadForm).subscribe(
              (event: HttpEvent<any>) => {
                switch (event.type) {
                  case HttpEventType.UploadProgress:
                    this.progressValue = (event.loaded / event.total) * 100;
                    this.showLoader = true;
                    break;

                  case HttpEventType.Response:
                    this.dialog.open(SuccessComponent, {
                      width: '450px',
                      data: { title: 'Success!', content: `MSM Uploaded Successfully.` }
                    })
                    this.showLoader = false;
                    this.cancelEvent();
                }//switch case.   
              },//event ends.
              err => {
                this.error = err;
                this.showLoader = false;
                this.dialog.open(FailureComponent, {
                  width: '350px',
                  data: { title: 'Failure!', content: `${err.error.message}` }
                });
              }) //err , subscribe ends.
          }, err => alert(`Please retry with correct password.`)
        ); //Login Subscribe ends.
      }
    });

  };//uploadEvent ends.

  selectEvent(file: File): void {
    this.progressValue = 0;
  }

  cancelEvent(): void {
    this.progressValue = 0;
  }

  ngOnInit() {

    this._product.getDivisions().subscribe(
      res => {
        this.category = res.category; this.subcategory1 = res.subcategory1; this.subcategory2 = res.subcategory2;
      },
      err => console.log(err)
    );

    this.filterForm = this.fb.group({
      sales_office: [[]],
      gtm_city: [[]],
      division: [[]],
      dc: [[]],
      active: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });

    this.uploadFilterForm = this.fb.group({
      sales_office: [[], Validators.required],
      gtm_city: [[]],
      division: [[], Validators.required],
      dc: [[], Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      category: [[], Validators.required],
      subcategory1: [[], Validators.required],
      subcategory2: [[], Validators.required],
      // msm_category: ['']
    })


    this.division = JSON.parse(localStorage.divisionList);
    this.sales_office = JSON.parse(localStorage.salesOfficeList);
    this.gtmCityList = JSON.parse(localStorage.gtmCityList);
    this.dcList = JSON.parse(localStorage.dcList);
  }


}


export interface MsmStatus {
  value: boolean | string;
  viewValue: string;
}

