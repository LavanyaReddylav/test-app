import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AttendanceService } from '../service/attendance.service';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { SaveFileService } from 'src/app/shared/service/save-file.service';

@Component({
  selector: 'travel-allowance',
  templateUrl: './travel-allowance.component.html',
  styleUrls: ['./travel-allowance.component.scss']
})
export class TravelAllowanceComponent implements OnInit {

  filterForm: FormGroup;

  loader: boolean = false;

  //selected options for the filter
  division: string[];
  sales_office: string[];
  gtm_city: string[];
  dcList: string[];

  constructor(private fb: FormBuilder, private _attendance: AttendanceService, public dialog: MatDialog, private _saveFile: SaveFileService) { }



  //Load Travel Allowance report.
  exportAsExcel() {
    this.loader = true;
    this._attendance.getTravelAllowances(this.filterForm.value).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Response:
            this._saveFile.saveAsExcelFile(event.body, 'Conveyance Allowance')
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

}
