import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MappingToolService } from '../service/mapping-tool.service';
import { ExcelService } from '../../shared/service/excel.service';
import { SuccessComponent } from '../../shared/modal/success/success.component';

@Component({
  selector: 'lasm-mapping-visibility',
  templateUrl: './lasm-mapping-visibility.component.html',
  styleUrls: ['./lasm-mapping-visibility.component.scss']
})
export class LasmMappingVisibilityComponent implements OnInit {

  filterForm: FormGroup;
  loader: boolean = false;
  downloadReady: boolean = false;
  downloadLink: string = '';
  errors: string[] = [];

  //selected options for the filter
  division: any[];
  sales_office: string[];
  gtm_city: string[];
  dcList: string[];
  userList: any[];

  user = new FormControl([], Validators.required);
  starting_date = new FormControl('', Validators.required);
  ending_date = new FormControl('', Validators.required);

  constructor(public dialog: MatDialog, private fb: FormBuilder, private _mapping: MappingToolService, private _excel: ExcelService) { }

  getLasmMapping(scan) {

    if (scan || this.filterForm.value.division.length > 1 || this.user.value.length > 10 || this.filterForm.value.sales_office[0] === 'UMAY') {
      let rgx = /@v5global.com/; let regex = /@usha.com/
      let email = scan ? prompt('Scanning & Validation might take long time, Please Provide Your Email id') : prompt('File you are requesting seems to be large, Please Provide Your Email id');
      if (!rgx.test(email) && !regex.test(email)) return alert('Email should contain domain @usha.com');

      //Register File Download request.
      this._mapping.getUserMapping({ ...this.filterForm.value, user: this.user.value, starting_date: this.starting_date.value, ending_date: this.ending_date.value, email, scan }).subscribe(
        (link) => {
          //Open Success Component.
          this.dialog.open(SuccessComponent, {
            width: '450px',
            data: { title: 'Success!', content: scan ? `Your request for file Scan & Validation has been registered successfully! Soon You will recieve download link via email.` : `Your request has been registered successfully! Soon You will recieve download link via email.` }
          });
        },
        err => console.log(err)
      );
      return;
    }

    this.loader = true;
    this._mapping.getUserMapping({ ...this.filterForm.value, user: this.user.value, starting_date: this.starting_date.value, ending_date: this.ending_date.value, scan }).subscribe(
      link => {
        this.loader = false;
        this.downloadReady = true;
        this.downloadLink = link;
      },
      err => { this.loader = false; console.log(err) }
    );
  }

  // Toggle All Selection.
  toggleAllSelection(selected, formControlName) {

    if (selected) {
      switch (formControlName) {
        case 'user':
          this.user.patchValue(this.userList.map(i => i.loginid));
          break;
        case 'division':
          this.filterForm.controls[formControlName].patchValue(this[formControlName].map(i => i.dvcode));
      }

    }
    else {
      if (this.filterForm.controls[formControlName]) this.filterForm.controls[formControlName].patchValue([]);
      this.user.setValue([]);
    }
  }

  //Get Users from selection.
  getUsers(value) {
    this.errors = [];
    this.loader = true;
    this.user.reset();
    this.userList = [];
    this._mapping.getUsers(value, { name: 1, loginid: 1, _id: 0 }).subscribe(
      (res: any) => {
        this.loader = false;
        this.userList = res;
      },
      (err) => { this.loader = false; console.log(err), this.errors.push(err.error.message) }
    );
  }

  //Get Division On the Basis of Sales Office Selected.
  getDivision(query) {
    this.loader = true;
    this.filterForm.get('division').reset();
    this.division = [];
    this._mapping.getDivision(query).subscribe(
      res => {
        this.division = res;
        if (query.sales_office[0] === 'UMAY') {
          this.filterForm.controls['division'].patchValue(this['division'].map(i => i.dvcode));
        }
        this.loader = false;
      },
      err => {
        this.loader = false;
        console.log(err);
      }
    );
  }

  //On Filter Form Selection Change.
  onSelectionChange() {
    this.filterForm.valueChanges.subscribe(value => {
      if (this.filterForm.valid) {
        this.getUsers(value);
      }
    });
    this.filterForm.get('sales_office').valueChanges.subscribe(value => {
      this.getDivision({ sales_office: value });
    });
  }

  //Download Report File Via Download Link.
  downloadReport() {
    window.open(this.downloadLink, '_blank');
    this.downloadReady = false;
  }

  ngOnInit() {
    this.filterForm = this.fb.group({
      sales_office: [[], Validators.required],
      gtm_city: [[], Validators.required],
      division: [[], Validators.required],
      dc: [[], Validators.required],
    });
    // this.division = JSON.parse(localStorage.divisionList);
    this.sales_office = JSON.parse(localStorage.salesOfficeList);
    this.gtm_city = JSON.parse(localStorage.gtmCityList);
    this.dcList = JSON.parse(localStorage.dcList);

    this.onSelectionChange();
  }

}
