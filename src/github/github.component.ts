import { Component } from '@angular/core';
import { GithubService } from './services/github.service';
import { OnInit } from '@angular/core';

import { ActionItem } from "../domain/action-item";

@Component({
  selector: 'github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.css']
})
export class GithubComponent {
  actionItems: ActionItem[];

  constructor(private githubService: GithubService) { }

  ngOnInit() {
    this.getGithubJobs();
    setInterval(() => {
      this.getGithubJobs();
    }, 1000000);
  }

  getGithubJobs(): void {
    this.githubService.getActionItems()
      .then(
        actionItems => {
          this.actionItems = actionItems; console.log(actionItems);
        }
      );
  }
}
