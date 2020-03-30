import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EkycComponent } from './ekyc.component';

const routes: Routes = [
  { path: '', component: EkycComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EkycRoutingModule { }
