import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilhotesComponent } from './filhotes.component';
import { FilhotesRoutingModule } from './filhotes-routing.module';

@NgModule({
  declarations: [
    FilhotesComponent
  ],
  imports: [
    CommonModule,
    FilhotesRoutingModule
  ]
})
export class FilhotesModule { }
