import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuccessComponent } from './modal/success/success.component';
import { FailureComponent } from './modal/failure/failure.component';
import { MaterialModule } from './material.module';
import { ConfirmationComponent } from './modal/confirmation/confirmation.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FilterPipe } from './pipe/gtm-city-filter.pipe';
import { TruncatePipe } from './pipe/truncate.pipe';
import { SearchPipe } from './pipe/user.pipe';
import { SkuPipe } from './pipe/sku.pipe';
import { Subcategory1Pipe } from './pipe/subcategory1-filter.pipe';
import { Subcategory2Pipe } from './pipe/subcategory2-filter.pipe';
import { CategoryPipe } from './pipe/category-filter.pipe';
import { ScreenshotComponent } from './modal/screenshot/screenshot.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CovalentFileModule } from '@covalent/core/file';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    CovalentFileModule
  ],
  entryComponents: [FailureComponent],
  exports: [SuccessComponent, FailureComponent, ConfirmationComponent, ScreenshotComponent, FilterPipe, TruncatePipe, SearchPipe, SkuPipe, Subcategory1Pipe, Subcategory2Pipe, CategoryPipe],
  declarations: [SuccessComponent, FailureComponent, ConfirmationComponent, FilterPipe, TruncatePipe, SearchPipe, SkuPipe, Subcategory1Pipe, Subcategory2Pipe, CategoryPipe, ScreenshotComponent]
})
export class SharedModule { }
