import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeatRoutingModule } from './beat-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BeatComponent } from './beat.component';
import { MaterialModule } from './material.module';
import { BeatMasterComponent } from './beat-master/beat-master.component';
import { BeatScheduleComponent } from './beat-schedule/beat-schedule.component';
import { BeatCalendarComponent } from './beat-calendar/beat-calendar.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CovalentFileModule, TdFileService } from '@covalent/core/file';
import { AddbeatComponent } from './beat-master/modal/addbeat/addbeat.component';
import { MasterTableComponent } from './beat-master/table/master-table/master-table.component';
import { SharedModule } from '../shared/shared.module';
import { SuccessComponent } from '../shared/modal/success/success.component';
import { ConfirmationComponent } from '../shared/modal/confirmation/confirmation.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FailureComponent } from '../shared/modal/failure/failure.component';
import { TokenInterceptorService } from '../authorization/token-interceptor.service';
import { BeatService } from './service/beat.service';
import { ScheduleTableComponent } from './beat-schedule/table/schedule-table/schedule-table.component';
import { ExcelService } from '../shared/service/excel.service';
import { EditCalendarComponent } from './beat-calendar/modal/edit-calendar/edit-calendar.component';
import { AddCalendarComponent } from './beat-calendar/modal/add-calendar/add-calendar.component';


@NgModule({
  imports: [
    CommonModule,
    BeatRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    CovalentFileModule
  ],
  providers: [
    BeatService,
    ExcelService,
    TdFileService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  entryComponents: [AddbeatComponent, EditCalendarComponent, SuccessComponent, ConfirmationComponent, FailureComponent, AddCalendarComponent],
  declarations: [BeatComponent, BeatMasterComponent, BeatScheduleComponent, BeatCalendarComponent, AddbeatComponent, MasterTableComponent, ScheduleTableComponent, EditCalendarComponent, AddCalendarComponent]
})
export class BeatModule { }
