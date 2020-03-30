import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material';
import { LoginComponent } from './login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private auth: AuthService, public dialog: MatDialog, private router: Router) { }

  canLoad(): boolean | Observable<boolean> | Promise<boolean> {
    if (this.auth.loggedIn()) return true;
    else {
      const dialogRef = this.dialog.open(LoginComponent, {
        width: '800px',
      });

      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['dashboard']);
      });

      return false
    }
  }

}
