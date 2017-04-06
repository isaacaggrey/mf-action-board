import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { JobDetails } from "../../domain/jobDetails";
import { ActionItem } from "../../domain/action-item";
import { PriorityCalculator } from "../../domain/priority-calculator";

@Injectable()
export class JenkinsService {

  public jenkinsJobs: string[] = [];
  public baseUrl: string = 'https://jenkins-oscf-sandbox.blackbaudcloud.com';
  public jobs: string[];

  constructor(private http: Http) {
    this.setJenkinsJobs();
    this.jobs = [];
    this.jobs.push('lo-groups_build');
    this.jobs.push('bluemoon-core_build');
    this.jobs.push('bluemoon-ui_build');
    this.jobs.push('notifications_build');
    this.jobs.push('bluemoon-admin-ui_build');
    this.jobs.push('segmentation-component_build');
  }

  setJenkinsJobs(): void {
    this.jenkinsJobs.push('lo-groups_build');
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  getActionItems(): Promise<ActionItem[]> {
    let jobsPromises = [];
    let newActionItems: ActionItem[] = [];
    this.jobs.forEach((jobUrl: string) => {
      let promise = this.http.get(this.baseUrl + '/job/' + jobUrl + '/lastBuild/api/json')
        .toPromise()
        .then(response => {
          let jobDetails = new JobDetails();
          jobDetails.result = response.json().result;
          jobDetails.timestamp = response.json().timestamp;
          jobDetails.jobName = jobUrl;
          jobDetails.building = response.json().building;
          if (jobDetails.result !== 'SUCCESS') {
            newActionItems.push(this.convertToActionItem(jobDetails));
          }
        })
        .catch(this.handleError);
      jobsPromises.push(promise);
    });
    return new Promise<ActionItem[]>((resolve, reject) => {
      Promise.all(jobsPromises).then(() => {
        resolve(newActionItems);
      });
    });
  }

  private convertToActionItem(jobDetails: JobDetails): ActionItem {
    return PriorityCalculator.calculatePriority({
      name: jobDetails.jobName,
      priority: 0,
      type: this.buildTypeString(jobDetails),
      source: 'jenkins',
      created: new Date(jobDetails.timestamp).getTime()
    });
  }

  private buildTypeString(jobDetails: JobDetails): string {
    return 'Jenkins Build ' + (jobDetails.building ? ' - building' : ' - ' + jobDetails.result);
  }
}
