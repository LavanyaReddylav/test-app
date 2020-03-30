import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../auth.service';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  matcher = new MyErrorStateMatcher();
  error: any;
  showError: boolean = false;
  changePasswordForm: FormGroup;
  showSpinner: boolean = false;
  invalidPassword: boolean = false;

  constructor(public dialogRef: MatDialogRef<ChangePasswordComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder, public dialog: MatDialog, private auth: AuthService) { }

  changePassword() {
    if (this.changePasswordForm.valid) {
      if (this.changePasswordForm.get('newPassword').value !== this.changePasswordForm.get('confirmPassword').value) this.invalidPassword = true;
      else {
        this.showSpinner = true;
        this.auth.changePassword(this.changePasswordForm.value).subscribe(
          res => {
            this.invalidPassword = false; this.showSpinner = false;
            this.dialog.open(SuccessComponent, {
              width: '450px',
              data: { title: 'Success!', content: `${res.message}` }
            });
          }, err => { this.invalidPassword = false; this.showSpinner = false; this.error = err; this.showError = true; }
        );
      }
    }
  }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]

    });
  }

}
