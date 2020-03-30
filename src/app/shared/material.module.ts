import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressBarModule } from '@angular/material';

@NgModule({
    imports: [MatButtonModule, MatIconModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressBarModule],
    exports: [MatButtonModule, MatIconModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressBarModule],
})
export class MaterialModule { }