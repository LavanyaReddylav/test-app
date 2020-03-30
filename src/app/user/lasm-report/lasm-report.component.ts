import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { ExcelService } from 'src/app/shared/service/excel.service';
// import { UserStatus } from 'src/app/user/user-master/user-master.component';
import { UserService } from '../service/user.service';


@Component({
  selector: 'lasm-report',
  templateUrl: './lasm-report.component.html',
  styleUrls: ['./lasm-report.component.scss']
})
export class LasmReportComponent implements OnInit {

  filterForm: FormGroup;
  showLoader: boolean = false;
  error: any;

  //selected options for the filter
  divisionList: string[];
  salesOfficeList: string[];
  gtm_city: string[];
  dcList: string[];
  userStatus: UserStatus[] = [{ value: '', viewValue: 'All' }, { value: true, viewValue: 'Active' }, { value: false, viewValue: 'InActive' }];

  constructor(public dialog: MatDialog, private fb: FormBuilder, private _user: UserService, private _excel: ExcelService) { }

  exportAsExcel() {
    this.showLoader = true;
    this._user.getLasmReport(this.filterForm.value).subscribe(
      res => {
        this._excel.exportAsExcelFile(res, 'LASM-Report');
        this.showLoader = false;
      },
      err => {
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
        this.showLoader = false;
      })

  }

  toggleAllSelection(selected, formControlName) {
    if (selected) {
      this.filterForm.controls[formControlName].patchValue(this[formControlName].map(i => i.name));
    }
    else {
      this.filterForm.controls[formControlName].patchValue([]);
    }
  }

  ngOnInit() {
    this.filterForm = this.fb.group({
      sales_office: [[], Validators.required],
      gtm_city: [[], Validators.required],
      division: [[], Validators.required],
      dc: [[]],
      active: ['']
    });
    this.divisionList = JSON.parse(localStorage.divisionList);
    this.salesOfficeList = JSON.parse(localStorage.salesOfficeList);
    this.gtm_city = JSON.parse(localStorage.gtmCityList);
    this.dcList = JSON.parse(localStorage.dcList);

  }

}

export interface UserStatus {
  value: boolean | string;
  viewValue: string;
}
