import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LengthComponent } from './length.component';

const routes: Routes = [
  { path: '', component: LengthComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LengthRoutingModule { }