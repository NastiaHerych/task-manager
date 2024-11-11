import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { SignUpPageComponent } from './components/pages/sign-up-page/sign-up-page.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { Route } from './shared/enums/route.enum';
import { CustomerDataResolver } from './shared/resolvers/customer-data-resolver';

const routes: Routes = [
  { path: Route.LOGIN, component: LoginPageComponent },
  { path: Route.SIGNUP, component: SignUpPageComponent },
  {
    path: Route.PROJECTS,
    component: HomePageComponent,
    canActivate: [AuthGuard],
    resolve: { customerData: CustomerDataResolver },
  },
  { path: '', redirectTo: Route.LOGIN, pathMatch: 'full' },
  { path: '**', redirectTo: Route.LOGIN },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
