import { NgModule } from '@angular/core';
import { MatTabsModule, MatIconModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatCardModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatMenuModule, MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule, MatListModule, MatProgressBarModule } from '@angular/material';

@NgModule({
    imports: [MatTabsModule, MatIconModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatCardModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatMenuModule, MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule, MatListModule, MatProgressBarModule],
    exports: [MatTabsModule, MatIconModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatCardModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatMenuModule, MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule, MatListModule, MatProgressBarModule],
})
export class MaterialModule { }