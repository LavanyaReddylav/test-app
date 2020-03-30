import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from 'src/app/authorization/auth.service';
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
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})
export class AdduserComponent implements OnInit {

  matcher = new MyErrorStateMatcher();
  showSpinner: boolean = false;
  userForm: FormGroup;

  //  selected options for the filters
  userRole: UserRole[] = [{ value: 'admin', viewValue: 'Admin' }, { value: 'isp', viewValue: 'ISP' }, { value: 'client', viewValue: 'Client' }];
  salesOfficeList: string[];
  dcList: string[];
  gtmCityList: string[];
  divisionList: string[];
  weeklyoffList: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(public dialogRef: MatDialogRef<AdduserComponent>, private fb: FormBuilder,
    private auth: AuthService, public dialog: MatDialog) { }

  //on submit form
  onSubmit() {
    this.showSpinner = true;
    this.auth.addUser(this.userForm.value).subscribe(
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
  }//on submit form

  ngOnInit() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      mobile: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      loginid: ['', Validators.required],
      role: ['', Validators.required],
      sales_office: [[], Validators.required],
      gtm_city: [[], Validators.required],
      division: [[], Validators.required],
      dc: [[], Validators.required],
      weekly_off: [[]],
      emp_code: [''],
      joining_date: ['', Validators.required],

    });
    this.divisionList = JSON.parse(localStorage.divisionList);
    this.salesOfficeList = JSON.parse(localStorage.salesOfficeList);
    this.gtmCityList = JSON.parse(localStorage.gtmCityList);
    this.dcList = JSON.parse(localStorage.dcList);
  }

}


export interface UserRole {
  value: string;
  viewValue: string;
}

