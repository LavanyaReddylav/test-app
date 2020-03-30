import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../service/product.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { MatDialog } from '@angular/material';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { ExcelService } from 'src/app/shared/service/excel.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'product-master',
  templateUrl: './product-master.component.html',
  styleUrls: ['./product-master.component.scss']
})
export class ProductMasterComponent implements OnInit {

  baseUrl: string = environment.uri;

  //categories.
  category;
  subcategory1;
  subcategory2;

  filterForm: FormGroup;
  products;
  showTable: boolean = false;
  showUpload: boolean = false;
  uploadForm: FormData;
  error: any;
  DownloadFormat: boolean = false;
  progressValue: number = 0;

  query = {
    division: [], category: [], subcategory1: [], subcategory2: [], dvcode: [], client_dv_code: [], active: true, material_group: [], sku: [], sku_code: []
  };

  //selected options for the filter
  division: string[];

  constructor(public dialog: MatDialog, private fb: FormBuilder, private _product: ProductService, private excel: ExcelService) { }

  //Download format.
  downloadFormat() {
    this.DownloadFormat = true;
  }

  // All
  toggleAllSelection(selected, formControlName) {
    if (selected) {
      this.filterForm.controls[formControlName].patchValue(this[formControlName].map(i => i.dvcode));
    }
    else {
      this.filterForm.controls[formControlName].patchValue([]);
    }
  }

  uploadEvent(file: File) {
    this.uploadForm = new FormData();
    this.uploadForm.append('excel', file);
    this._product.uploadProducts(this.uploadForm).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressValue = (event.loaded / event.total) * 100;
            break;
          case HttpEventType.Response:
            this.dialog.open(SuccessComponent, {
              width: '550px',
              data: { title: 'Success!', content: `Products Uploaded Successfully.` }
            })
        }//switch case.
      },//event ends.
      err => {
        this.error = err;
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
      });//err ends.
  };//uploadEvent ends

  selectEvent(file: File): void {
    this.progressValue = 0;
  }

  cancelEvent(): void {
    this.progressValue = 0;
  }

  //load products
  loadProducts() {
    this.products = null;
    this.showTable = true;
    this.query.dvcode = this.filterForm.value.division;
    this.query.category = this.filterForm.value.category;
    this.query.subcategory1 = this.filterForm.value.subcategory1;
    this.query.subcategory2 = this.filterForm.value.subcategory2;
    this._product.getProducts(this.query).subscribe(
      res => {
        this.products = res;
      },
      err => {
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
        this.showTable = false;
      }
    )
  }// load products


  //Export Beats.
  exportAsExcel() {
    const data = this.products.map((item: any) => {
      return {
        'SKU Code': item.sku_code,
        'Division': item.division,
        'DV Code': item.dvcode,
        'Client DV Code': item.client_dv_code,
        'Material Group': item.material_group,
        'SKU': item.sku,
        'Category': item.category,
        'Sub Category1': item.subcategory1,
        'Sub Category2': item.subcategory2
      }
    });
    this.excel.exportAsExcelFile(data, 'products');
  }

  ngOnInit() {

    this._product.getDivisions().subscribe(
      res => {
        this.category = res.category; this.subcategory1 = res.subcategory1; this.subcategory2 = res.subcategory2;
      },
      err => console.log(err)
    );

    this.filterForm = this.fb.group({
      division: [[]],
      category: [[]],
      subcategory1: [[]],
      subcategory2: [[]]

    });
    this.division = JSON.parse(localStorage.divisionList);
  }

}
