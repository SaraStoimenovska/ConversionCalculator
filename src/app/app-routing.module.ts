import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'currency', pathMatch: 'full'  },
  { path: 'currency', loadChildren: () => import('./currency/currency.module').then(x => x.CurrencyModule) },
  { path: 'length', loadChildren: () => import('./length/length.module').then(x => x.LengthModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }