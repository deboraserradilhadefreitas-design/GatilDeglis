import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, RouterModule, MatCardModule],
  exports: [HeaderComponent, RouterModule, MatCardModule]
})
export class SharedModule { }
