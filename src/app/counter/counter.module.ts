import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CounterRoutingModule } from './counter-routing.module';
import { CounterComponent } from './counter.component';
import { MaterialModule } from './material.module';
import { CounterMasterComponent } from './counter-master/counter-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CovalentFileModule, TdFileService } from '@covalent/core/file';
import { CovalentVirtualScrollModule } from '@covalent/core/virtual-scroll';
import { AddcounterComponent } from './counter-master/modal/addcounter/addcounter.component';
import { MasterTableComponent } from './counter-master/table/master-table/master-table.component';
import { MapBeatComponent } from './counter-master/modal/map-beat/map-beat.component';
import { MapDistributorComponent } from './counter-master/modal/map-distributor/map-distributor.component';
import { SharedModule } from '../shared/shared.module';
import { SuccessComponent } from '../shared/modal/success/success.component';
import { FailureComponent } from '../shared/modal/failure/failure.component';
import { ConfirmationComponent } from '../shared/modal/confirmation/confirmation.component';
import { CounterService } from './service/counter.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from '../authorization/token-interceptor.service';
import { CounterMappingComponent } from './counter-mapping/counter-mapping.component';
import { AddMsmComponent } from './counter-master/modal/add-msm/add-msm.component';
import { AddSkuComponent } from './counter-master/modal/add-sku/add-sku.component';
import { MapUoidComponent } from './map-uoid/map-uoid.component';


@NgModule({
  imports: [
    CommonModule,
    CounterRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    CovalentFileModule,
    CovalentVirtualScrollModule,
    NgxMaterialTimepickerModule.forRoot()
  ],
  providers: [CounterService,
    TdFileService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }],
  entryComponents: [AddcounterComponent, MapBeatComponent, MapDistributorComponent, SuccessComponent, FailureComponent, ConfirmationComponent, AddMsmComponent, AddSkuComponent],
  declarations: [CounterComponent, CounterMasterComponent, AddcounterComponent, MasterTableComponent, MapBeatComponent, MapDistributorComponent, CounterMappingComponent, AddMsmComponent, AddSkuComponent, MapUoidComponent]
})
export class CounterModule { }
