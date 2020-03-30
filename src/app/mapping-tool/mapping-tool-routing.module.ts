import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MappingToolComponent } from './mapping-tool.component';

const routes: Routes = [
  { path: '', component: MappingToolComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MappingToolRoutingModule { }
