import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MsmRoutingModule } from './msm-routing.module';
import { MsmComponent } from './msm.component';
import { MaterialModule } from './material.module';
import { MsmMasterComponent } from './msm-master/msm-master.component';
import { CovalentFileModule } from '@covalent/core/file';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { MsmPanelComponent } from './msm-master/panel/msm-panel/msm-panel.component';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { ConfirmationComponent } from 'src/app/shared/modal/confirmation/confirmation.component';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { MatNativeDateModule } from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    MsmRoutingModule,
    MaterialModule,
    FormsModule,
    SharedModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    CovalentFileModule,
    MatNativeDateModule

  ],
  entryComponents: [SuccessComponent, ConfirmationComponent, FailureComponent],
  declarations: [MsmComponent, MsmMasterComponent, MsmPanelComponent]
})
export class MsmModule { }
