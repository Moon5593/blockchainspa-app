import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from "./auth/login/login.component";
import { BlockchainListComponent } from "./blockchain/blockchain-list/blockchain-list.component";

const routes: Routes = [
  { path: '', redirectTo: '/blockchain', pathMatch: 'full' },
  { path: "blockchain", component: BlockchainListComponent, canActivate: [AuthGuard] },
  { path: "logout", component: LoginComponent },
  { path: "auth", loadChildren: ()=>import( "./auth/auth.module").then(m=>m.AuthModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
