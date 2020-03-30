import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-failure',
  templateUrl: './failure.component.html',
  styleUrls: ['./failure.component.scss']
})

export class FailureComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FailureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  close() {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}

export interface DialogData {
  title: string,
  content: string
}