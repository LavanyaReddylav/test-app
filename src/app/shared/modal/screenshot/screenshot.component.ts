import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AppService } from '../../../app.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SuccessComponent } from '../success/success.component';
import { FailureComponent } from '../failure/failure.component';

@Component({
  selector: 'app-screenshot',
  templateUrl: './screenshot.component.html',
  styleUrls: ['./screenshot.component.scss']
})
export class ScreenshotComponent implements OnInit {

  @ViewChild('canvas') canvas: ElementRef;
  form: FormGroup;
  form_data: FormData;
  type: string[];
  files: FileList;
  fileSelectMultipleMsg: string;


  constructor(public dialogRef: MatDialogRef<ScreenshotComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private _appservice: AppService, private fb: FormBuilder, public dialog: MatDialog) { }

  changeStatus() {

  }
  ngOnInit() {
    this.form = this.fb.group({
      remarks: ['', Validators.required],
      type: ['', Validators.required]
    })
    this.type = ['Technical', 'Functional', 'Operational'];

  }
  ngAfterViewInit() {
    setTimeout(() => {
      let ctx = this.canvas.nativeElement.getContext('2d');
      let canvas_data = this.data['canvas'];
      let context = canvas_data.getContext('2d');
      context.width = 500;
      context.height = 280;
      ctx.drawImage(canvas_data, 0, 0, context.width, context.height)
    }, 0);
  }

  onSubmit() {
    this.form_data = new FormData();
    this.data['canvas'].toBlob((blob) => {
      this.form_data.append('image', blob);
      this.form_data.append('data', JSON.stringify({
        remarks: this.form.controls['remarks'].value,
        type: this.form.controls['type'].value
      }))


      if (this.files && this.files.length)
        for (let i = 0; i < this.files.length; i++) {
          this.form_data.append('ticket-files', this.files[i]);
        }

      this._appservice.genereteTicket(this.form_data).subscribe(
        res => {
          this.dialog.open(SuccessComponent, {
            width: '550px',
            data: { title: 'Success!', content: `Ticket Added Successfulyy!!!.` }
          })
        },
        err => {
          this.dialog.open(FailureComponent, {
            width: '350px',
            data: { title: 'Failure!', content: `${err.error.message}` }
          });
        }
      )
    })
    this.dialogRef.close();
  }

  uploadEvent(event) {
    this.files = undefined;
    this.files = event.target.files;
  }


  selectEvent(files: FileList | File): void {
    if (files instanceof FileList) {
      let names: string[] = [];
      for (let i: number = 0; i < files.length; i++) {
        names.push(files[i].name);
      }
      this.fileSelectMultipleMsg = names.join(',');
    } else {
      this.fileSelectMultipleMsg = files.name;
    }
  }

  cancelEvent(): void {

  }
}