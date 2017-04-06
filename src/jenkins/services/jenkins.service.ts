import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { JobDetails } from "../../domain/jobDetails";
import { ActionItem } from "../../domain/action-item";
import { PriorityCalculator } from "../../domain/priority-calculator";

import { JENKINS_ENV } from '../../config/app-config-constants';

@Injectable()
export class JenkinsService {

  public baseUrl: string = 'https://jenkins-oscf-sandbox.blackbaudcloud.com';
  public jobs: string[];

  constructor(private http: Http) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  getActionItems(): Promise<ActionItem[]> {
    let jobsPromises = [];
    let newActionItems: ActionItem[] = [];
    JENKINS_ENV.forEach((env) => {
      let url = env.url;
      let envProjects = env.projects;
      envProjects.forEach((project) => {
        console.log(project);
        let promise = this.http.get(url + 'job/' + project + '/lastBuild/api/json')
          .toPromise()
          .then(response => {
            let jobDetails = new JobDetails();
            jobDetails.result = response.json().result;
            jobDetails.timestamp = response.json().timestamp;
            jobDetails.jobName = project;
            jobDetails.building = response.json().building;
            if (jobDetails.result !== 'SUCCESS') {
              newActionItems.push(this.convertToActionItem(jobDetails));
            }
          })
          .catch(this.handleError);
        jobsPromises.push(promise);
      });
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
