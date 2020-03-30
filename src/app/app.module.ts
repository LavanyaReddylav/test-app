import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToastrModule } from 'ngx-toastr';
import { AuthorizationModule } from './authorization/authorization.module';
import { AuthService } from './authorization/auth.service';
import { ChangePasswordComponent } from 'src/app/authorization/change-password/change-password.component';
import { DataService } from './shared/service/data.service';
import { LocationStrategy, HashLocationStrategy, Location, PathLocationStrategy } from '@angular/common';
import { ScreenshotComponent } from './shared/modal/screenshot/screenshot.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    AuthorizationModule
  ],
  entryComponents: [ChangePasswordComponent, ScreenshotComponent],
  providers: [AuthService, DataService, { provide: LocationStrategy, useClass: PathLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
