import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FilhotesComponent } from './filhotes.component';

const routes: Routes = [
  {
    path: '',
    component: FilhotesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilhotesRoutingModule { }
