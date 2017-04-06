import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { JenkinsComponent } from '../jenkins/jenkins.component';
import { JenkinsService } from '../jenkins/services/jenkins.service';

import { GithubComponent } from '../github/github.component';
import { GithubService } from '../github/services/github.service';

@NgModule({
  declarations: [
    AppComponent,
    JenkinsComponent,
    GithubComponent
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
