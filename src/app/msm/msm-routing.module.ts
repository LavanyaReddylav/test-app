import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsmComponent } from './msm.component';

const routes: Routes = [
  { path: '', component: MsmComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MsmRoutingModule { }
