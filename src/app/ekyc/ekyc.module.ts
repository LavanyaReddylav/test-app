import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EkycRoutingModule } from './ekyc-routing.module';
import { EkycComponent } from './ekyc.component';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EkycService } from './service/ekyc.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from '../authorization/token-interceptor.service';
import { FailureComponent } from '../shared/modal/failure/failure.component';
import { DownloadComponent } from './download/download.component';

@NgModule({
  imports: [
    CommonModule,
    EkycRoutingModule,
    MaterialModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  declarations: [EkycComponent, DownloadComponent],
  providers: [EkycService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }],
  entryComponents: [FailureComponent]
})
export class EkycModule { }
