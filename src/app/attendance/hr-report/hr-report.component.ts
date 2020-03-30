import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { AttendanceService } from '../service/attendance.service';
import { MatDialog, ErrorStateMatcher, DateAdapter, NativeDateAdapter, MatOption } from '@angular/material';
import { SaveFileService } from 'src/app/shared/service/save-file.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'hr-report',
  templateUrl: './hr-report.component.html',
  styleUrls: ['./hr-report.component.scss'],
})


export class HrReportComponent implements OnInit {

  filterForm: FormGroup;

  loader: boolean = false;

  //selected options for the filter
  division: string[];
  sales_office: string[];
  gtm_city: string[];
  dcList: string[];

  @ViewChild('AllGtmCity') private AllGtmCity: MatOption;

  constructor(private fb: FormBuilder, private _attendance: AttendanceService, public dialog: MatDialog, private _saveFile: SaveFileService) { }


  //Load Conveyance HR report.
  exportAsExcel() {
    console.log(this.filterForm.value);
    this.loader = true;
    this._attendance.getHrReport(this.filterForm.value).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Response:
            this._saveFile.saveAsExcelFile(event.body, 'Conveyance HR Report')
            this.dialog.open(SuccessComponent, {
              width: '450px',
              data: { title: 'Success!', content: `File Downloaded Successfully.` }
            })
            this.loader = false;
        }//switch case.
      },//event ends.
      err => {
        this.loader = false;
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
      }

    ); //subscribe ends here.
  } //exportAsExcel ends here.


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


  ngOnInit() {
    this.filterForm = this.fb.group({
      sales_office: [[], Validators.required],
      gtm_city: [[], Validators.required],
      division: [[], Validators.required],
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

}
