import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyComponent } from './currency.component';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CurrencyRoutingModule } from './currency-routing.module';


@NgModule({
  declarations: [
    CurrencyComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CurrencyRoutingModule,
    FlexLayoutModule
  ],
  providers: []
})
export class CurrencyModule { }
