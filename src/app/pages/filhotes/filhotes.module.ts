import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FilhotesComponent } from './filhotes.component';
import { FilhotesRoutingModule } from './filhotes-routing.module';

@NgModule({
  declarations: [
    FilhotesComponent
  ],
  imports: [
    CommonModule,
    FilhotesRoutingModule,
    ReactiveFormsModule
  ]
})
export class FilhotesModule { }
