import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { MatDialog } from '@angular/material';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { AttendanceService } from '../service/attendance.service';
import { ExcelService } from 'src/app/shared/service/excel.service';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  reportForm: FormGroup;
  attendances;
  showTable: boolean = false;

  //selected options for the filter
  division: string[];
  sales_office: string[];
  gtm_city: string[];
  dcList: string[];
  userStatus: UserStatus[] = [{ value: '', viewValue: 'All' }, { value: true, viewValue: 'Active' }, { value: false, viewValue: 'InActive' }];


  constructor(private fb: FormBuilder, private _attendance: AttendanceService, public dialog: MatDialog, private excel: ExcelService) { }

  //Load attendance report
  loadReport() {
    this.showTable = true;
    this.attendances = null;
    this._attendance.getAttendances(this.reportForm.value).subscribe(
      res => {
        this.attendances = res;
      },
      err => {
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
        this.showTable = false;
      }
    );
  }// Load attendance report

  // All
  toggleAllSelection(selected, formControlName) {
    if (selected) {
      switch (formControlName) {
        case 'sales_office':
          this.reportForm.controls[formControlName].patchValue(this[formControlName]);
          break;
        case 'gtm_city':
          this.reportForm.controls[formControlName].patchValue(this[formControlName].map(i => i.name));
          break;
        case 'division':
          this.reportForm.controls[formControlName].patchValue(this[formControlName].map(i => i.dvcode));
      }

    }
    else {
      this.reportForm.controls[formControlName].patchValue([]);
    }
  }

  //Export Beats.
  exportAsExcel() {
    const data = this.attendances.map((item: any) => {
      return {
        'Date': item['Date'].split('T')[0],
        'Employee Code': item['Employee Code'],
        'LASM Name': item['LASM Name'],
        'Loginid': item['Loginid'],
        'Sales Office': Array.isArray(item['Sales Office']) ? item['Sales Office'].join(',') : item['Sales Office'],
        'GTM City': Array.isArray(item['GTM City']) ? item['GTM City'].join(',') : item['GTM City'],
        'Division': Array.isArray(item['Division']) ? item['Division'].join(',') : item['Division'],
        'DC': Array.isArray(item['DC']) ? item['DC'].join(',') : item['DC'],
        'Active': item['Active'],
        'Status': item.status,
        // 'Source': item.source,
        // 'At': item.at,
        'Checkin Time': item.checkin.time,
        'Checkout Time': item.checkout.time,
        'Reason': item.reason,
        'Checkin Remarks': item.checkin.remarks,
        'Checkout Remarks': item.checkout.remarks,
        'Checkin Latitude': item.checkin.latitude,
        'Checkin Longitude': item.checkin.longitude,
        'CheckOut Latitude': item.checkout.latitude,
        'CheckOut Longitude': item.checkout.longitude,
        'Checkin Image Url': item.checkin.image,
        'Checkout Image Url': item.checkout.image
      }

    });
    this.excel.exportAsExcelFile(data, 'attendance');
  }

  ngOnInit() {
    this.reportForm = this.fb.group({
      sales_office: [[]],
      gtm_city: [[]],
      division: [[]],
      dc: [[]],
      starting_date: [''],
      ending_date: [''],
      active: ['']
    });
    this.division = JSON.parse(localStorage.divisionList);
    this.sales_office = JSON.parse(localStorage.salesOfficeList);
    this.gtm_city = JSON.parse(localStorage.gtmCityList);
    this.dcList = JSON.parse(localStorage.dcList);

  }


}
export interface UserStatus {
  value: boolean | string;
  viewValue: string;
}
