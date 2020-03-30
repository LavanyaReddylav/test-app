import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AddSkuComponent } from '../add-sku/add-sku.component';
import { CounterService } from 'src/app/counter/service/counter.service';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';

@Component({
  selector: 'app-add-msm',
  templateUrl: './add-msm.component.html',
  styleUrls: ['./add-msm.component.scss']
})
export class AddMsmComponent implements OnInit {

  skus;
  start_date;
  end_date;

  constructor(public dialogRef: MatDialogRef<AddMsmComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private _counter: CounterService) { }

  //Open Add sku.
  addSku() {
    const dialogRef = this.dialog.open(AddSkuComponent, {
      width: '900px',
      data: { divisions: this.data.divisions }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value && value.length) {
        this.skus = value.map(i => {
          i.target_quantity = 0;
          return i;
        });
      }
    });
  }

  //Remove sku from selected skus list.
  remove(index) {
    console.log(this.skus[index]);
    this.skus.splice(index, 1);
  }

  //Add MSM Complete Model.
  addMsm() {
    const msm = this.skus.map(i => {
      return { sku: i.sku_code, target_quantity: i.target_quantity }
    });

    this._counter.addMSM({ start_date: this.start_date, end_date: this.end_date, msm, counter: this.data.counter, sales_office: this.data.sales_office, division: this.data.divisions })
      .subscribe(
        res => {
          this.dialog.open(SuccessComponent, {
            width: '450px',
            data: { title: 'Success!', content: `Must Sale Model Added Successfully!` }
          });
        },
        err => {
          this.dialog.open(FailureComponent, {
            width: '350px',
            data: { title: 'Failure!', content: `${err.error.message}` }
          });
        },
      );

    this.dialogRef.close();
  }// Add MSM.

  //Cancel.
  cancel(value) {
    this.dialogRef.close(value)
  }

  ngOnInit() { }

}// Class ends here.

export interface DialogData {
  divisions: string[],
  counter: number[],
  sales_office: string[]
}