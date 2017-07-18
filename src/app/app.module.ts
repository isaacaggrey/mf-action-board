import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ActionItemsComponent } from '../action-items/action-items.component';

import { JenkinsService } from '../jenkins/services/jenkins.service';
import { GithubService } from '../github/services/github.service';

@NgModule({
  declarations: [
    AppComponent,
    ActionItemsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [JenkinsService, GithubService],
  bootstrap: [AppComponent]
})
export class AppModule { }
