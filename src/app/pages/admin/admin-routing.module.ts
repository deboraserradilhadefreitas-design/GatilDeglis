// arquivo responsável pelas rotas específicas do módulo admin. Como ele é acessado somente quando digitado /admin no navegador, precisa para mostrar o adminComponent. 

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
