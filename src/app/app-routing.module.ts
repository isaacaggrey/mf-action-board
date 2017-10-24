import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActionListComponent } from './action-list/action-list.component';
import { ConfigScreenComponent } from './config-screen/config-screen.component';

const routes: Routes = [
  {path: 'config', component: ConfigScreenComponent},
  {path: '', component: ActionListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
