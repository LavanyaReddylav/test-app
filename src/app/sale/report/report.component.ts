import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SaleService } from '../service/sale.service';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { MatDialog } from '@angular/material';
import { ExcelService } from 'src/app/shared/service/excel.service';

@Component({
  selector: 'sale-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  saleForm: FormGroup;
  sales;
  showTable: boolean = false;

  //selected options for the filter
  division: string[];
  sales_office: string[];
  gtm_city: string[];
  dcList: string[];

  constructor(private fb: FormBuilder, private _sales: SaleService, public dialog: MatDialog, private excel: ExcelService) { }

  //load sales report
  loadSale() {
    this.showTable = true;
    this.sales = null;
    this._sales.getSales(this.saleForm.value).subscribe(
      res => {
        this.sales = res;
      },
      err => {
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
        this.showTable = false;
      }
    );

  }//load sales report

  // All
  toggleAllSelection(selected, formControlName) {
    if (selected) {
      switch (formControlName) {
        case 'sales_office':
          this.saleForm.controls[formControlName].patchValue(this[formControlName]);
          break;
        case 'gtm_city':
          this.saleForm.controls[formControlName].patchValue(this[formControlName].map(i => i.name));
          break;
        case 'division':
          this.saleForm.controls[formControlName].patchValue(this[formControlName].map(i => i.dvcode));
      }
    }
    else {
      this.saleForm.controls[formControlName].patchValue([]);
    }
  }

  //Export Beats.
  exportAsExcel() {
    this.excel.exportAsExcelFile(this.sales, 'sales');
  }

  ngOnInit() {
    this.saleForm = this.fb.group({
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
    this.gtm_city = JSON.parse(localStorage.gtmCityList);
    this.dcList = JSON.parse(localStorage.dcList);
  }
}
