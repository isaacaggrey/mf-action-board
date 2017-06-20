import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { JobDetails } from "../../domain/jobDetails";
import { ActionItem } from "../../domain/action-item";
import { PriorityCalculator } from "../../domain/priority-calculator";
import { Headers, RequestOptions } from '@angular/http';

import { JENKINS_ENV } from '../../config/app-config-constants';
import { GITHUB_USER, GITHUB_TOKEN } from '../../config/app-config-constants';

@Injectable()
export class JenkinsService {

  constructor(private http: Http) {}

  getActionItems(): Promise<ActionItem[]> {
    const headers = new Headers({'Authorization': 'Basic ' + window.btoa(GITHUB_USER + ':' + GITHUB_TOKEN)});
    const options = new RequestOptions({headers: headers});
    const envPromises = [];
    const newActionItems: ActionItem[] = [];
    JENKINS_ENV.forEach((env) => {
      const url = env.url;
      const envProjects = env.projects.reduce((map, obj) => {
        map[obj] = obj;
        return map;
      }, {});
      const promise = this.http.get(
        url + 'api/json?tree=jobs[name,lastCompletedBuild[number,duration,timestamp,result,url]]', options)
        .toPromise()
        .then((response) => this.processJobs(response, newActionItems, envProjects))
        .catch(this.handleError);
      envPromises.push(promise);
    });
    return new Promise<ActionItem[]>((resolve) => {
      Promise.all(envPromises).then(() => {
        resolve(newActionItems);
      });
    });
  }

  private processJobs(response, newActionItems, envProjects) {
      const jobs = response.json().jobs;
      jobs.forEach((job) => this.addNewActionItem(job, envProjects, newActionItems));
  }

  private addNewActionItem(job, envProjects, newActionItems) {
    const lastCompletedBuild = job.lastCompletedBuild;
    if (lastCompletedBuild) {
      const jobName = job.name;
      const jobStatus = lastCompletedBuild.result;
      if (envProjects[jobName] && jobStatus === 'FAILURE') {
        const jobUrl = lastCompletedBuild.url;
        const buildTimestamp = lastCompletedBuild.timestamp;
        const jobDetails = new JobDetails();
        jobDetails.result = jobStatus;
        jobDetails.jobName = jobName;
        jobDetails.timestamp = buildTimestamp;
        jobDetails.building = jobStatus === 'blue-anime';
        jobDetails.url = jobUrl;
        newActionItems.push(this.convertToActionItem(jobDetails));
      }
    }
  }

  private convertToActionItem(jobDetails: JobDetails): ActionItem {
    return PriorityCalculator.calculatePriority({
      name: jobDetails.jobName,
      priority: 0,
      type: this.buildTypeString(jobDetails),
      source: 'jenkins',
      created: new Date(jobDetails.timestamp).getTime(),
      url: jobDetails.url
    });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    // ignore failure so that Promise.All() in calling component can resolve successful calls
    return Promise.resolve();
  }

  private buildTypeString(jobDetails: JobDetails): string {
    return 'Jenkins Build ' + (jobDetails.building ? ' - building' : ' - ' + jobDetails.result);
  }
}
