import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';

import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
    ]
})
export class AdminModule { 
}
