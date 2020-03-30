import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { CounterService } from 'src/app/counter/service/counter.service';
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
  selector: 'app-addcounter',
  templateUrl: './addcounter.component.html',
  styleUrls: ['./addcounter.component.scss']
})
export class AddcounterComponent implements OnInit {

  matcher = new MyErrorStateMatcher();
  showSpinner: boolean = false;
  counterForm: FormGroup;

  //  selected options for the filters
  salesOfficeList: string[];
  dcs: string[];
  gtmCityList: string[];
  divisionList: string[];
  weeklyoffList: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  activeList: Active[] = [{ value: true, viewValue: 'true' }, { value: false, viewValue: 'false' }];
  counterClassList: Class[] = [{ value: 'A', viewValue: 'A' }, { value: 'B', viewValue: 'B' }, { value: 'C', viewValue: 'D' }, { value: 'E', viewValue: 'E' }];

  constructor(public dialogRef: MatDialogRef<AddcounterComponent>, private fb: FormBuilder,
    private toastr: ToastrService, private _counter: CounterService, public dialog: MatDialog) { }

  //add counter
  addCounter() {
    this.showSpinner = true;
    this._counter.addCounter(this.counterForm.value).subscribe(
      res => {
        this.showSpinner = false;
        this.dialog.open(SuccessComponent, {
          width: '450px',
          data: { title: 'Success!', content: `${res.message}` }
        });
      },
      err => {
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
      }
    );
  }  //add counter

  ngOnInit() {
    this.counterForm = this.fb.group({
      name: ['', Validators.required],
      sap_code: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
      pan_number: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      gst_number: ['', Validators.compose([Validators.required, Validators.minLength(15), Validators.maxLength(15)])],
      active: ['', Validators.required],
      counter_class: ['', Validators.required],
      sales_office: ['', Validators.required],
      gtm_city: ['', Validators.required],
      division: [[], Validators.required],
      dc: [[], Validators.required],
      weekly_off: [[]],
      opening_time: ['', Validators.required],
      closing_time: ['', Validators.required],
      address: this.fb.group({ // make a nested group
        address: ['', Validators.required],
        locality: ['', Validators.required],
        pincode: ['', Validators.required],
      })
    });
    this.divisionList = JSON.parse(localStorage.divisionList);
    this.salesOfficeList = JSON.parse(localStorage.salesOfficeList);
    this.gtmCityList = JSON.parse(localStorage.gtmCityList);
    this.dcs = JSON.parse(localStorage.dcList);
  }

}


export interface UserRole {
  value: string;
  viewValue: string;
}


export interface DC {
  value: string;
  viewValue: string;
}
export interface Active {
  value: boolean;
  viewValue: string;
}
export interface Class {
  value: String;
  viewValue: string;
}