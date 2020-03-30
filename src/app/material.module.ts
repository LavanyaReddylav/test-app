import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatIconModule, MatToolbarModule, MatSidenavModule, MatListModule, MatTabsModule, MatProgressBarModule, MatMenuModule } from '@angular/material';

@NgModule({
    imports: [MatButtonModule, MatCheckboxModule, MatIconModule, MatToolbarModule, MatSidenavModule, MatListModule, MatTabsModule, MatProgressBarModule, MatMenuModule],
    exports: [MatButtonModule, MatCheckboxModule, MatIconModule, MatToolbarModule, MatSidenavModule, MatListModule, MatTabsModule, MatProgressBarModule, MatMenuModule],
})
export class MaterialModule { }