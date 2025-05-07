import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { GestisciOrdiniAttesaComponent } from './pages/gestisci-ordini-attesa/gestisci-ordini-attesa.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import { GestioneMenuComponent } from './pages/gestione-menu/gestione-menu.component';
export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: "login",
        component: HomeComponent,
    },
    {
        path: "ordiniAttesa",
        component: GestisciOrdiniAttesaComponent,
    },
    {
        path:"dashboard",
        component: DashboardComponent,
    },
    {
        path:"gestioneMenu",
        component: GestioneMenuComponent,
    }
];
