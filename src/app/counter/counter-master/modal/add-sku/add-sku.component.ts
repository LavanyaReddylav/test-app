import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ProductService } from 'src/app/product/service/product.service';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';

@Component({
  selector: 'app-add-sku',
  templateUrl: './add-sku.component.html',
  styleUrls: ['./add-sku.component.scss']
})
export class AddSkuComponent implements OnInit {

  products;
  skus;
  searchText: string = '';

  constructor(public dialogRef: MatDialogRef<AddSkuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public dialog: MatDialog, private _product: ProductService) { }

  //Cancel.
  cancel(value) {
    this.dialogRef.close(value)
  }

  //Add Seleted Skus.
  addSkus(searchText: string) {
    searchText = searchText.toLowerCase();
    this.skus = this.products.filter(it => {
      if (it.sku_code.toLowerCase().includes(searchText) || it.category.toLowerCase().includes(searchText) || it.subcategory1.toLowerCase().includes(searchText) || it.material_group.toLowerCase().includes(searchText) || it.dvcode.toLowerCase().includes(searchText) || it.division.toLowerCase().includes(searchText) || it.sku.toLowerCase().includes(searchText))
        return true;
      else return false;
    });
    this.cancel(this.skus);
  }


  ngOnInit() {
    this._product.getProducts({
      division: [], category: [], subcategory1: [],
      subcategory2: [], dvcode: this.data.divisions, client_dv_code: [], active: true, material_group: [],
      sku: [], sku_code: []
    }).subscribe(
      res => {
        this.products = res;
      },
      err => {
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
      }
    );
  }

}

export interface DialogData {
  divisions: string[]
}