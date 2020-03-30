import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributorRoutingModule } from './distributor-routing.module';
import { DistributorComponent } from './distributor.component';
import { MaterialModule } from './material.module';
import { DistributorMasterComponent } from './distributor-master/distributor-master.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CovalentFileModule, TdFileService } from '@covalent/core/file';
import { AddDistributorComponent } from './distributor-master/modal/add-distributor/add-distributor.component';
import { MasterTableComponent } from './distributor-master/table/master-table/master-table.component';
import { SharedModule } from '../shared/shared.module';
import { SuccessComponent } from '../shared/modal/success/success.component';
import { ConfirmationComponent } from '../shared/modal/confirmation/confirmation.component';
import { DistributorService } from './service/distributor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from '../authorization/token-interceptor.service';
import { FailureComponent } from '../shared/modal/failure/failure.component';

@NgModule({
  imports: [
    CommonModule,
    DistributorRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CovalentFileModule
  ],
  providers: [DistributorService,
    TdFileService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  entryComponents: [AddDistributorComponent, SuccessComponent, ConfirmationComponent, FailureComponent],
  declarations: [DistributorComponent, DistributorMasterComponent, AddDistributorComponent, MasterTableComponent]
})
export class DistributorModule { }
