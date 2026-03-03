import { RouterModule, Routes } from '@angular/router';


import { HomeComponent } from './pages/home/home.component';
import { ContatosComponent } from './pages/contatos/contatos.component';
import { FilhotesComponent } from './pages/filhotes/filhotes.component';

export const routes: Routes = [
    {path:'', component: HomeComponent },    //Página Inicial (Home)
    {path:'contatos', component: ContatosComponent },   //Página de Contatos    
    {path: 'filhotes', component: FilhotesComponent},   //Página de filhotes
    {path: 'admin',
    loadChildren: () =>             //"lazy loading" Só carrega o código do módulo admin quando o usuário acessar a rota /admin.
        import('./pages/admin/admin.module').then(m => m.AdminModule)
    }
];
