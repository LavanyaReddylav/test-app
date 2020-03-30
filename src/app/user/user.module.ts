import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserComponent } from './user.component';
import { UserMasterComponent } from './user-master/user-master.component';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CovalentFileModule, TdFileService } from '@covalent/core/file';
import { AdduserComponent } from './user-master/modal/adduser/adduser.component';
import { MasterTableComponent } from './user-master/table/master-table/master-table.component';
import { SharedModule } from '../shared/shared.module';
import { SuccessComponent } from '../shared/modal/success/success.component';
import { ConfirmationComponent } from '../shared/modal/confirmation/confirmation.component';
import { FailureComponent } from '../shared/modal/failure/failure.component';
import { UserService } from './service/user.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from '../authorization/token-interceptor.service';
import { LasmReportComponent } from './lasm-report/lasm-report.component';
import { ModifyUserComponent } from './user-master/modal/modify-user/modify-user.component';
import { TicketComponent } from './ticket/ticket.component';
import { TicketTableComponent } from './ticket/table/ticket-table/ticket-table.component';


@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CovalentFileModule
  ],
  providers: [UserService,
    TdFileService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }],
  entryComponents: [AdduserComponent, SuccessComponent, ConfirmationComponent, FailureComponent, ModifyUserComponent],
  declarations: [UserComponent, UserMasterComponent, AdduserComponent, MasterTableComponent, LasmReportComponent, ModifyUserComponent, TicketComponent, TicketTableComponent]
})
export class UserModule { }
