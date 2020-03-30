import { NgModule } from '@angular/core';
import { MatIconModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatCardModule, MatInputModule, MatCheckboxModule, MatMenuModule, MatProgressSpinnerModule } from '@angular/material';

@NgModule({
    imports: [MatIconModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatCardModule, MatInputModule, MatCheckboxModule, MatMenuModule, MatProgressSpinnerModule],
    exports: [MatIconModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatCardModule, MatInputModule, MatCheckboxModule, MatMenuModule, MatProgressSpinnerModule],
})
export class MaterialModule { }