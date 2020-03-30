import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormGroupDirective, FormControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { BeatService } from 'src/app/beat/service/beat.service';
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
  selector: 'app-addbeat',
  templateUrl: './addbeat.component.html',
  styleUrls: ['./addbeat.component.scss']
})
export class AddbeatComponent implements OnInit {


  showSpinner: boolean = false;
  beatForm: FormGroup;

  //selected options for the filter
  salesOfficeList: string[];
  dcs: string[];
  gtmCityList: string[];
  divisionList: string[];

  constructor(public dialogRef: MatDialogRef<AddbeatComponent>, private fb: FormBuilder,
    private _beat: BeatService, public dialog: MatDialog) { }

  //add beat
  addBeat() {
    this.showSpinner = true;
    this._beat.addBeat(this.beatForm.value).subscribe(
      res => {
        this.showSpinner = false;
        this.dialogRef.close();
        this.dialog.open(SuccessComponent, {
          width: '450px',
          data: { title: 'Success!', content: `${res.message}` }
        });
      },
      err => {
        this.showSpinner = false;
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
      }
    );
  }

  //Ng onInit.
  ngOnInit() {
    this.beatForm = this.fb.group({
      name: ['', Validators.required],
      division: [[], Validators.required],
      sales_office: ['', Validators.required],
      gtm_city: ['', Validators.required],
      dc: [[], Validators.required]
    });
    this.divisionList = JSON.parse(localStorage.divisionList);
    this.salesOfficeList = JSON.parse(localStorage.salesOfficeList);
    this.gtmCityList = JSON.parse(localStorage.gtmCityList);
    this.dcs = JSON.parse(localStorage.dcList);
  }

}


export interface DC {
  value: string;
  viewValue: string;
}