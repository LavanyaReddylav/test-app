import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { ProductMasterComponent } from './product-master/product-master.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CovalentFileModule, TdFileService } from '@covalent/core/file';
import { MaterialModule } from './material.module';
import { MasterTableComponent } from './product-master/table/master-table/master-table.component';
import { ConfirmationComponent } from '../shared/modal/confirmation/confirmation.component';
import { SuccessComponent } from '../shared/modal/success/success.component';
import { SharedModule } from '../shared/shared.module';
import { ProductService } from './service/product.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from '../authorization/token-interceptor.service';
import { FailureComponent } from '../shared/modal/failure/failure.component';

@NgModule({
  imports: [
    CommonModule,
    ProductRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CovalentFileModule
  ],
  providers: [ProductService,
    TdFileService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }],
  entryComponents: [ConfirmationComponent, SuccessComponent, FailureComponent],
  declarations: [ProductComponent, ProductMasterComponent, MasterTableComponent]
})
export class ProductModule { }
