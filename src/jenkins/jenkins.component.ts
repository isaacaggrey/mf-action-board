import { Component } from '@angular/core';
import { JenkinsService } from './services/jenkins.service';
import { OnInit } from '@angular/core';

import { Job } from '../domain/job';

@Component({
  selector: 'jenkins',
  templateUrl: './jenkins.component.html',
  styleUrls: ['./jenkins.component.css']
})
export class JenkinsComponent {
  jobs: Job[];

  constructor(private jenkinsService: JenkinsService) { }

  ngOnInit() {
    this.getJenkinsJobs();
  }

  getJenkinsJobs(): void {
    this.jenkinsService.getBuilds().then(jobs => this.jobs = jobs);
  }
}
