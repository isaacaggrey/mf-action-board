import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { JenkinsComponent } from '../jenkins/jenkins.component';

import { JenkinsService } from '../jenkins/services/jenkins.service';

@NgModule({
  declarations: [
    AppComponent,
    JenkinsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [JenkinsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
