import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { AddDistributorComponent } from './modal/add-distributor/add-distributor.component';
import { DistributorService } from '../service/distributor.service';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { ExcelService } from 'src/app/shared/service/excel.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'distributor-master',
  templateUrl: './distributor-master.component.html',
  styleUrls: ['./distributor-master.component.scss']
})
export class DistributorMasterComponent implements OnInit {

  baseUrl: string = environment.uri;

  filterForm: FormGroup;
  distributors;
  showTable: boolean = false;
  showUpload: boolean = false;
  uploadForm: FormData;
  error: any;
  DownloadFormat: boolean = false;
  progressValue: number = 0;

  //selected options for the filter
  division: string[];
  sales_office: string[];
  gtm_city: string[];
  dcList: string[];
  distributorStatus: DistributorStatus[] = [{ value: '', viewValue: 'All' }, { value: true, viewValue: 'Active' }, { value: false, viewValue: 'InActive' }];

  constructor(public dialog: MatDialog, private fb: FormBuilder, private _distributor: DistributorService, private excel: ExcelService) { }

  //Download format.
  downloadFormat() {
    this.DownloadFormat = true;
  }

  // All
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
    this._distributor.uploadDistributors(this.uploadForm).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressValue = (event.loaded / event.total) * 100;
            break;
          case HttpEventType.Response:
            this.dialog.open(SuccessComponent, {
              width: '550px',
              data: { title: 'Success!', content: `Distributors Uploaded Successfully.` }
            })
        }//switch case.
      },//event ends.
      err => {
        this.error = err;
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
      })//err, subscriber  ends.
  };// uploadEvent ends

  selectEvent(file: File): void {
    this.progressValue = 0;
  }

  cancelEvent(): void {
    this.progressValue = 0;
  }

  //open dialog
  openDialog(): void {
    const dialogRef = this.dialog.open(AddDistributorComponent, {
      width: '650px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }//open dialog

  //load distributors
  loadDistributors() {
    this.distributors = null;
    this.showTable = true;
    this._distributor.getDistributors(this.filterForm.value).subscribe(
      res => {
        this.distributors = res;
      },
      err => {
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
        this.showTable = false;
      }
    );

  }//load distributors


  //Export Beats.
  exportAsExcel() {
    const data = this.distributors.map((item: any) => {
      return {
        'Name': item.name,
        'Mobile': item.mobile,
        'Distributor Code': item.sap_code,
        'Active': item.active,
        'Sales Office': item.sales_office.join(', '),
        'Gtm City': item.gtm_city.join(', '),
        'Distribution Channel': item.dc.join(', '),
        'Division': item.division.join(', '),
        'Joining Date': item.joining_date.map(i => i.split('T')[0]).join(', '),
        'Leaving Date': item.leaving_date.map(i => i.split('T')[0]).join(', '),
      }
    });
    this.excel.exportAsExcelFile(data, 'distributors');
  }

  ngOnInit() {
    this.filterForm = this.fb.group({
      sales_office: [[]],
      gtm_city: [[]],
      division: [[]],
      dc: [[]],
      active: [''],
      sap_code: [[]]
    });
    this.division = JSON.parse(localStorage.divisionList);
    this.sales_office = JSON.parse(localStorage.salesOfficeList);
    this.gtm_city = JSON.parse(localStorage.gtmCityList);
    this.dcList = JSON.parse(localStorage.dcList);
  }
}


export interface DistributorStatus {
  value: boolean | string;
  viewValue: string;
}