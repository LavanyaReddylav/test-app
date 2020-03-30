import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../auth.service';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { DataService } from 'src/app/shared/service/data.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  show: boolean = true;
  showSpinner: boolean = false;
  status: number;
  error: string;
  error1: string;

  invalidCredentials: boolean = false;
  invalidLoginid: boolean = false;

  matcher = new MyErrorStateMatcher();

  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<LoginComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder, private auth: AuthService, public dialog: MatDialog, private _data: DataService) {
    dialogRef.disableClose = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  showForgotpassword() {
    this.show = !this.show;
  }

  loginFormSubmit() {
    if (this.loginForm.valid) {
      this.showSpinner = true;
      this.auth.login(this.loginForm.value).subscribe(
        res => {
          this.showSpinner = false;
          localStorage.token = res.token;
          localStorage.user = JSON.stringify(res.user);

          //Loading DC List.
          this._data.getDC().subscribe(
            res => { localStorage.dcList = JSON.stringify(res); },
            err => { console.log(err) }
          );

          //Loading Division List.
          this._data.getDivision().subscribe(
            res => {
              localStorage.divisionList = JSON.stringify(res);
            },
            err => console.log(err)
          );
          //Loading Sales Office List.
          this._data.getSalesOffices().subscribe(
            res => {
              localStorage.salesOfficeList = JSON.stringify(res);
            },
            err => console.log(err)
          );
          //Loading GTM city List.
          this._data.getGtmCities().subscribe(
            res => {
              localStorage.gtmCityList = JSON.stringify(res);
            },
            err => console.log(err)
          );
          this.dialogRef.close();
        },
        err => {
          this.showSpinner = false;
          this.invalidCredentials = true;
          this.status = err.status; this.error = err.error.message;
        }
      );

    }
  }

  forgotPasswordFormSubmit() {
    this.showSpinner = true;
    this.auth.resetPassword(this.forgotPasswordForm.value).subscribe(
      res => {
        this.showSpinner = false;
        this.dialog.open(SuccessComponent, {
          width: '450px',
          data: { title: 'Success!', content: `${res.message}` }
        });
      },
      err => {
        this.showSpinner = false;
        this.invalidLoginid = true;
        this.status = err.status; this.error1 = err.error.message;
      }
    )
  }


  ngOnInit() {
    this.loginForm = this.fb.group({
      loginid: ['', Validators.required],
      password: ['', Validators.required]

    });
    this.forgotPasswordForm = this.fb.group({
      loginid: ['', Validators.required],
      email: [''],
    });

  }

}

