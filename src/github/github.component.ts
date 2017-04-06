import { Component } from '@angular/core';
import { GithubService } from './services/github.service';
import { OnInit } from '@angular/core';

import { Job } from '../domain/job';

@Component({
  selector: 'github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.css']
})
export class GithubComponent {
  jobs: Job[];

  constructor(private githubService: GithubService) { }

  ngOnInit() {
    this.getGithubJobs();
    setInterval(() => {
      this.getGithubJobs();
    }, 1000000);
  }

  getGithubJobs(): void {
    this.githubService.getActionItems();
      //.then(
      //  jobs => {
      //    this.jobs = jobs; console.log(jobs);
      //  }
      //);
  }
}
