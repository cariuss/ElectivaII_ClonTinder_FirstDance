import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MainRoutingModule } from './main-routing.module';
import { DiscoverComponent } from './pages/discover/discover.component';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MatchesListComponent } from './pages/matches-list/matches-list.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DiscoverComponent,
    ProfileCardComponent,
    ProfileComponent,
    MatchesListComponent,
    ChatWindowComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class MainModule { }
