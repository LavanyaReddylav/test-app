import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MappingToolRoutingModule } from './mapping-tool-routing.module';
import { MappingToolComponent } from './mapping-tool.component';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from '../authorization/token-interceptor.service';
import { SuccessComponent } from '../shared/modal/success/success.component';
import { FailureComponent } from '../shared/modal/failure/failure.component';
import { ConfirmationComponent } from '../shared/modal/confirmation/confirmation.component';
import { MappingToolService } from './service/mapping-tool.service';
import { MasterMappingComponent } from './master-mapping/master-mapping.component';
import { LasmMappingVisibilityComponent } from './lasm-mapping-visibility/lasm-mapping-visibility.component';

@NgModule({
  imports: [
    CommonModule,
    MappingToolRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    NgxMatSelectSearchModule
  ],
  providers: [
    MappingToolService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  entryComponents: [SuccessComponent, FailureComponent, ConfirmationComponent],
  declarations: [MappingToolComponent, MasterMappingComponent, LasmMappingVisibilityComponent]
})
export class MappingToolModule { }
