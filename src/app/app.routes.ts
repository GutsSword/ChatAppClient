import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const routes: Routes = [
    {
        path: "",
        component : HomeComponent,
        canActivate: [()=> inject(AuthService).isAuthentication()]
    },
    {
        path: "login",
        component : LoginComponent
    },
    {
        path: "register",
        component : RegisterComponent
    }
];
