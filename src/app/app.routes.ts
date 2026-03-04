import { RouterModule, Routes } from '@angular/router';


import { HomeComponent } from './pages/home/home.component';
import { ContatosComponent } from './pages/contatos/contatos.component';

export const routes: Routes = [
    {path:'', component: HomeComponent },    //Página Inicial (Home)
    {path:'contatos', component: ContatosComponent },   //Página de Contatos    
    {path: 'filhotes',
    loadChildren: () =>             //"lazy loading" Só carrega o código do módulo filhotes quando o usuário acessar a rota /filhotes.
        import('./pages/filhotes/filhotes.module').then(m => m.FilhotesModule)
    },
    {path: 'admin',
    loadChildren: () =>             //"lazy loading" Só carrega o código do módulo admin quando o usuário acessar a rota /admin.
        import('./pages/admin/admin.module').then(m => m.AdminModule)
    }
];
