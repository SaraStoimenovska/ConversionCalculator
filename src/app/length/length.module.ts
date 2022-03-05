import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LengthComponent } from './length.component';
import { LengthRoutingModule } from './length-routing.module';

@NgModule({
  declarations: [LengthComponent],
  imports: [CommonModule, SharedModule, LengthRoutingModule, FlexLayoutModule],
  providers: [],
})
export class LengthModule {}
