import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './attendance.component';
import { ReportComponent } from './report/report.component';
import { SheetComponent } from './sheet/sheet.component';
import { SummaryComponent } from './summary/summary.component';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { ReportTableComponent } from './report/table/report-table/report-table.component';
import { AttendanceService } from './service/attendance.service';
import { FailureComponent } from '../shared/modal/failure/failure.component';
import { TravelAllowanceComponent } from './travel-allowance/travel-allowance.component';
import { HrReportComponent } from './hr-report/hr-report.component';

@NgModule({
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedModule
  ],
  entryComponents: [FailureComponent],
  providers: [AttendanceService],
  declarations: [AttendanceComponent, ReportComponent, SheetComponent, SummaryComponent, ReportTableComponent, TravelAllowanceComponent, HrReportComponent]
})
export class AttendanceModule { }
