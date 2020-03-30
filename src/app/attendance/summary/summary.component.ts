import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AttendanceService } from '../service/attendance.service';
import { MatDialog } from '@angular/material';
import { ExcelService } from 'src/app/shared/service/excel.service';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';



@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  summaryForm: FormGroup;
  showLoader: boolean = false;
  //selected options for the filter
  division: string[];
  sales_office: string[];
  gtm_city: string[];
  dcList: string[];


  date = new Date();
  //Date Picker Min and Max.
  maxDate = new Date();

  constructor(private fb: FormBuilder, private _attendance: AttendanceService, public dialog: MatDialog, private excel: ExcelService) { }


  // export data in excel
  exportAsExcel() {
    console.log(this.summaryForm.value)
    this.showLoader = true;
    this._attendance.getSummary(this.summaryForm.value).subscribe(
      res => {
        this.excel.exportAsExcelFile(res, 'Attendance-Summary');
        this.showLoader = false;
      },
      err => {
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
        this.showLoader = false;
      }
    )
  }
  // All
  toggleAllSelection(selected, formControlName) {
    if (selected) {
      switch (formControlName) {
        case 'sales_office':
          this.summaryForm.controls[formControlName].patchValue(this[formControlName]);
          break;
        case 'gtm_city':
          this.summaryForm.controls[formControlName].patchValue(this[formControlName].map(i => i.name));
          break;
        case 'division':
          this.summaryForm.controls[formControlName].patchValue(this[formControlName].map(i => i.dvcode));
      }

    }
    else {
      this.summaryForm.controls[formControlName].patchValue([]);
    }
  }


  ngOnInit() {
    this.summaryForm = this.fb.group({
      sales_office: [[]],
      gtm_city: [[]],
      division: [[]],
      dc: [[]],
      starting_date: ['', Validators.required],
      ending_date: ['', Validators.required],
      active: ['']
    });
    this.division = JSON.parse(localStorage.divisionList);
    this.sales_office = JSON.parse(localStorage.salesOfficeList);
    this.gtm_city = JSON.parse(localStorage.gtmCityList);
    this.dcList = JSON.parse(localStorage.dcList);
  }

  // custom validator function for date picker.
  DateMatchValidator(value1: string, value2: string) {
    return (group: FormGroup) => {
      if (group.controls[value2].value - group.controls[value1].value > 2592000000) {
        return group.controls[value2].setErrors({ ending_date_error: true })
      }
      else
        return group.controls[value2].setErrors(null)
    }
  }
}


