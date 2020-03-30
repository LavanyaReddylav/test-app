import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BeatComponent } from './beat.component';

const routes: Routes = [
  { path: '', component: BeatComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeatRoutingModule { }
