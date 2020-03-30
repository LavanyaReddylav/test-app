import { Component, OnInit } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChangePasswordComponent } from './authorization/change-password/change-password.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { LoginComponent } from './authorization/login/login.component';
import html2canvas from 'html2canvas';
import { ScreenshotComponent } from './shared/modal/screenshot/screenshot.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  user: string = "Usha";
  Query: any = {};
  constructor(private router: Router, private spinner: NgxSpinnerService,
    public dialog: MatDialog) { }

  logoutUser() {
    localStorage.clear();
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['dashboard']);
    });
  }//logoutUser ends.

  ngOnInit() {
    // this.user = JSON.parse(localStorage.user).loginid;
    //Show Loader for lazy loaded modules.
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.spinner.show();
      } else if (event instanceof RouteConfigLoadEnd) {
        this.spinner.hide();
      }
    });

  }//ngOnInit ends.

  ChangePassword(): void {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }//ChangePassword ends.

  // screenshot
  captureScreen() {
    let wrappeer = document.getElementById('wrapper')
    html2canvas(wrappeer).then(canvas => {
      // dailog data
      const dialogConfig = new MatDialogConfig();
      dialogConfig.minWidth = '50vw';
      dialogConfig.minHeight = '70vh';
      dialogConfig.data = {
        canvas
      }
      const dialogRef = this.dialog.open(ScreenshotComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog closed ${result}`)
      });
    });
  }

}//class ends.


