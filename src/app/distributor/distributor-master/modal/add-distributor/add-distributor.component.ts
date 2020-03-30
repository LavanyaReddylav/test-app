import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DistributorService } from 'src/app/distributor/service/distributor.service';
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
  selector: 'app-add-distributor',
  templateUrl: './add-distributor.component.html',
  styleUrls: ['./add-distributor.component.scss']
})
export class AddDistributorComponent implements OnInit {

  matcher = new MyErrorStateMatcher();
  showSpinner: boolean = false;
  distributorForm: FormGroup;

  //  selected options for the filters
  activeRole: Active[] = [{ value: 'true', viewValue: 'true' }, { value: 'false', viewValue: 'false' }];
  salesOfficeList: string[];
  dcs: string[];
  gtmCityList: string[];
  divisionList: string[];

  constructor(public dialogRef: MatDialogRef<AddDistributorComponent>, private fb: FormBuilder,
    private _distributor: DistributorService, public dialog: MatDialog) { }

  //add distributor
  addDistributor() {
    this.showSpinner = true;
    this._distributor.addDistributor(this.distributorForm.value).subscribe(
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
  }//add distributor

  ngOnInit() {
    this.distributorForm = this.fb.group({
      active: ['', Validators.required],
      name: ['', Validators.required],
      sap_code: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      mobile: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      sales_office: [[], Validators.required],
      gtm_city: [[], Validators.required],
      division: [[], Validators.required],
      dc: [[], Validators.required],
    });
    this.divisionList = JSON.parse(localStorage.divisionList);
    this.salesOfficeList = JSON.parse(localStorage.salesOfficeList);
    this.gtmCityList = JSON.parse(localStorage.gtmCityList);
    this.dcs = JSON.parse(localStorage.dcList);
  }

}

export interface Active {
  value: string;
  viewValue: string;
}

export interface DC {
  value: string;
  viewValue: string;
}