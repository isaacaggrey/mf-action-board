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
  jobs: string[];
  actionItems: ActionItem[];

  constructor(private jenkinsService: JenkinsService) {
    this.jobs = [];
    this.jobs.push('lo-groups_build');
    this.jobs.push('bluemoon-core_build');
  }

  ngOnInit() {
    this.getJenkinsJobDetails();
    // setInterval(() => {
    //   this.getJenkinsJobDetails();
    // }, 10000);
  }

  getJenkinsJobDetails() : void {
    this.actionItems = this.jenkinsService.getJenkinsJobDetails(this.jobs);
  }

  // getJenkinsJobs(): void {
  //   this.jenkinsService.getBuilds()
  //     .then(
  //       jobs => {
  //         this.jobs = jobs; console.log(jobs);
  //       }
  //     );
  // }
}
