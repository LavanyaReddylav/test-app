import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaleRoutingModule } from './sale-routing.module';
import { SaleComponent } from './sale.component';
import { ReportComponent } from './report/report.component';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReportTableComponent } from './report/table/report-table/report-table.component';
import { SaleService } from './service/sale.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FailureComponent } from '../shared/modal/failure/failure.component';
import { MailersComponent } from './mailers/mailers.component';

@NgModule({
  imports: [
    CommonModule,
    SaleRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FlexLayoutModule,

  ],
  providers: [SaleService],
  entryComponents: [FailureComponent],
  declarations: [SaleComponent, ReportComponent, ReportTableComponent, MailersComponent]
})
export class SaleModule { }
