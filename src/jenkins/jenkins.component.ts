import { Component } from '@angular/core';
import { JenkinsService } from './services/jenkins.service';
import { OnInit } from '@angular/core';

import { Job } from '../domain/job';
import { ActionItem } from "../domain/action-item";

@Component({
  selector: 'jenkins',
  templateUrl: './jenkins.component.html',
  styleUrls: ['./jenkins.component.css']
})
export class JenkinsComponent {
  jobs: Job[];
  actionItems: ActionItem;

  constructor(private jenkinsService: JenkinsService) { }

  ngOnInit() {
    this.getJenkinsJobDetails();
    // setInterval(() => {
    //   this.getJenkinsJobDetails();
    // }, 10000);
  }

  getJenkinsJobDetails() : void {
    this.jenkinsService.getSingleJobDetail('lo-groups_build')
      .then(
        actionItems => {
          this.actionItems = actionItems;
        }
      );
  }

  getJenkinsJobs(): void {
    this.jenkinsService.getBuilds()
      .then(
        jobs => {
          this.jobs = jobs; console.log(jobs);
        }
      );
  }
}
