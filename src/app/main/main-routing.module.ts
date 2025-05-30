import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscoverComponent } from './pages/discover/discover.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MatchesListComponent } from './pages/matches-list/matches-list.component';

const routes: Routes = [
  { path: 'discover', component: DiscoverComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'matches', component: MatchesListComponent },
  { path: '', redirectTo: 'discover', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
