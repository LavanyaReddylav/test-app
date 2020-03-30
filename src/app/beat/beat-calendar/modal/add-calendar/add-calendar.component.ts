import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BeatService } from 'src/app/beat/service/beat.service';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';

@Component({
  selector: 'app-add-calendar',
  templateUrl: './add-calendar.component.html',
  styleUrls: ['./add-calendar.component.scss']
})
export class AddCalendarComponent implements OnInit {

  addScheduleForm: FormGroup;

  constructor(private fb: FormBuilder, public dialog: MatDialog, public dialogRef: MatDialogRef<AddCalendarComponent>, @Inject(MAT_DIALOG_DATA) public data, private _beat: BeatService) { }

  // Close.
  cancel(value) {
    this.dialogRef.close(value);
  }

  addSchedule() {
    this._beat.addSchedule(this.addScheduleForm.value).subscribe(
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

  ngOnInit() {
    //Edit Schedule Form.
    this.addScheduleForm = this.fb.group({
      beat: [''],
      date: [new Date()],
      user: [this.data.user.loginid]
    });

  }//ngOnInit.

}
