import { Component, OnInit, Inject, ComponentFactoryResolver } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BeatData } from 'src/app/beat/model/beat-model';
import { BeatService } from 'src/app/beat/service/beat.service';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';

@Component({
  selector: 'app-edit-calendar',
  templateUrl: './edit-calendar.component.html',
  styleUrls: ['./edit-calendar.component.scss']
})

export class EditCalendarComponent implements OnInit {

  editScheduleForm: FormGroup;

  constructor(private fb: FormBuilder, public dialog: MatDialog, public dialogRef: MatDialogRef<EditCalendarComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private _beat: BeatService) { }

  //Delete Schedule.
  delete() {
    this._beat.deleteSchedule(this.data.schedule._id).subscribe(
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
    this.cancel(true);
  }

  // Close.
  cancel(value) {
    this.dialogRef.close(value);
  }

  //Update Function.
  update() {

    this._beat.updateSchedule(this.editScheduleForm.value).subscribe(
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
    this.cancel(true);
  }//Update Function.

  ngOnInit() {
    //Edit Schedule Form.
    this.editScheduleForm = this.fb.group({
      beat: [this.data.schedule.beat],
      date: [this.data.schedule.date],
      _id: [this.data.schedule._id]
    });

  }//ngOnInit.

}

export interface DialogData {
  schedule: {
    beat: string,
    date: string
    _id: string
  },
  beats: BeatData[]
}