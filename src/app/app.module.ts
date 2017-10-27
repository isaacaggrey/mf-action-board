import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { JenkinsService } from '../jenkins/services/jenkins.service';
import { GithubService } from '../github/services/github.service';
import { VstsService } from '../github/services/vsts.service';
import { ConfigService } from './config.service';
import { RefreshService } from './refresh.service';
import { NotificationsService } from '../notifications/services/notifications.service';
import { PullRequestComponent } from './pull-request/pull-request.component';
import { RageFaceComponent } from './rage-face/rage-face.component';
import { BuildComponent } from './build/build.component';
import { ConfigScreenComponent } from './config-screen/config-screen.component';
import { AppRoutingModule } from './app-routing.module';
import { SprintLitComponent } from './sprint-lit/sprint-lit.component';
import { ActionListComponent } from './action-list/action-list.component';

@NgModule({
  declarations: [
    AppComponent,
    PullRequestComponent,
    RageFaceComponent,
    BuildComponent,
    ConfigScreenComponent,
    SprintLitComponent,
    ActionListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule
  ],
  providers: [
    JenkinsService,
    GithubService,
    VstsService,
    ConfigService,
    NotificationsService,
    RefreshService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
