import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SaleService } from '../service/sale.service';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { MatDialog } from '@angular/material';
import { ExcelService } from 'src/app/shared/service/excel.service';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';

@Component({
  selector: 'sale-mailers',
  templateUrl: './mailers.component.html',
  styleUrls: ['./mailers.component.scss']
})
export class MailersComponent implements OnInit {

  mailForm: FormGroup;

  //selected options for the filter
  division: string[];
  sales_office: string[];
  gtm_city: string[];
  dcList: string[];

  constructor(private fb: FormBuilder, private _sales: SaleService, public dialog: MatDialog, private excel: ExcelService) { }

  //Send Mailers.
  sendMailers() {
    this._sales.sendMailers(this.mailForm.value).subscribe(
      res => {
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
  }

  // All
  toggleAllSelection(selected, formControlName) {
    if (selected) {
      switch (formControlName) {
        case 'sales_office':
          this.mailForm.controls[formControlName].patchValue(this[formControlName]);
          break;
        case 'gtm_city':
          this.mailForm.controls[formControlName].patchValue(this[formControlName].map(i => i.name));
          break;
        case 'division':
          this.mailForm.controls[formControlName].patchValue(this[formControlName].map(i => i.dvcode));
      }
    }
    else {
      this.mailForm.controls[formControlName].patchValue([]);
    }
  }

  ngOnInit() {
    this.mailForm = this.fb.group({
      sales_office: [[]],
      gtm_city: [[]],
      division: [[]],
      dc: [[]],
      active: '',
      starting_date: '',
      ending_date: ''
    });
    this.division = JSON.parse(localStorage.divisionList);
    this.sales_office = JSON.parse(localStorage.salesOfficeList);
    this.dcList = JSON.parse(localStorage.dcList);
  }
}
