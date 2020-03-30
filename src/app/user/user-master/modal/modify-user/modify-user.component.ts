import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { UserService } from 'src/app/user/service/user.service';
import { UserData } from 'src/app/user/model/user-model';
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
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.scss']
})
export class ModifyUserComponent implements OnInit {

  matcher = new MyErrorStateMatcher();
  showSpinner: boolean = false;
  modifyUserForm: FormGroup;

  //  selected options for the filters
  userRole: UserRole[] = [{ value: 'admin', viewValue: 'Admin' }, { value: 'isp', viewValue: 'ISP' }, { value: 'client', viewValue: 'Client' }];
  salesOfficeList: string[];
  dcList: string[];
  gtmCityList: string[];
  divisionList: string[];
  weeklyoffList: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  userStatus: UserStatus[] = [{ value: true, viewValue: 'Active' }, { value: false, viewValue: 'InActive' }];

  constructor(private fb: FormBuilder, public dialog: MatDialog, public dialogRef: MatDialogRef<ModifyUserComponent>, @Inject(MAT_DIALOG_DATA) public data: UserData, private _user: UserService, private cdr: ChangeDetectorRef) { }


  // modify user 
  onSubmit() {
    this.showSpinner = true;
    this._user.EditUser(this.modifyUserForm.value).subscribe(
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
      });
  }

  ngOnInit() {
    this.modifyUserForm = this.fb.group({
      _id: [this.data._id],
      name: [this.data.name],
      mobile: [this.data.mobile],
      email: [this.data.email],
      loginid: [this.data.loginid],
      role: [this.data.role],
      sales_office: [this.data.sales_office],
      gtm_city: [this.data.gtm_city],
      division: [this.data.division],
      dc: [this.data.dc],
      weekly_off: [this.data.weekly_off],
      joining_date: [this.data.joining_date],
      password: [this.data.password],
      leaving_date: [this.data.leaving_date],
      active: [this.data.active],
      emp_code: [this.data.emp_code],

    });
    this.cdr.detectChanges(); // detect changes

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
export interface UserStatus {
  value: boolean | string;
  viewValue: string;
}