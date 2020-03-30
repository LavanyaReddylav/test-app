import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './authorization/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full', canLoad: [AuthGuard] },
  { path: 'beat', loadChildren: './beat/beat.module#BeatModule', canLoad: [AuthGuard] },
  { path: 'counter', loadChildren: './counter/counter.module#CounterModule', canLoad: [AuthGuard] },
  { path: 'user', loadChildren: './user/user.module#UserModule', canLoad: [AuthGuard] },
  { path: 'distributor', loadChildren: './distributor/distributor.module#DistributorModule', canLoad: [AuthGuard] },
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', canLoad: [AuthGuard] },
  { path: 'product', loadChildren: './product/product.module#ProductModule', canLoad: [AuthGuard] },
  { path: 'attendance', loadChildren: './attendance/attendance.module#AttendanceModule', canLoad: [AuthGuard] },
  { path: 'sale', loadChildren: './sale/sale.module#SaleModule', canLoad: [AuthGuard] },
  { path: 'mapping', loadChildren: './mapping-tool/mapping-tool.module#MappingToolModule', canLoad: [AuthGuard] },
  { path: 'msm', loadChildren: './msm/msm.module#MsmModule', canLoad: [AuthGuard] },
  { path: 'ekyc', loadChildren: './ekyc/ekyc.module#EkycModule', canLoad: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
