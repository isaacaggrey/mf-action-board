import { Component } from '@angular/core';
import { JenkinsService } from './services/jenkins.service';
import { OnInit } from '@angular/core';

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
    this.jobs.push('bluemoon-ui_build');
    this.jobs.push('notifications_build');
  }

  ngOnInit() {
    this.getJenkinsJobDetails();
    // setInterval(() => {
    //   this.getJenkinsJobDetails();
    // }, 10000);
  }

  getJenkinsJobDetails() : void {
    this.jenkinsService.getJenkinsJobDetails(this.jobs)
      .then(
        actionItems => {
          this.actionItems = actionItems; console.log(actionItems);
        }
      );
  }
}
