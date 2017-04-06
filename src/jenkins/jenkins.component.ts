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
  actionItems: ActionItem[];

  constructor(private jenkinsService: JenkinsService) {
  }

  ngOnInit() {
    this.getJenkinsJobDetails();
  }

  getJenkinsJobDetails() : void {
    this.jenkinsService.getActionAlerts()
      .then(
        actionItems => {
          this.actionItems = actionItems; console.log(actionItems);
        }
      );
  }
}
