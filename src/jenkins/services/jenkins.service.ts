import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { JobDetails } from '../../domain/jobDetails';
import { ActionItem } from '../../domain/action-item';
import { PriorityCalculator } from '../../domain/priority-calculator';
import { Headers, RequestOptions } from '@angular/http';

import { GITHUB_TEAM_ID, JENKINS_BUILD_SUCCESS_STRING, JENKINS_ENV } from '../../config/app-config-constants';
import { GITHUB_USER, GITHUB_TOKEN } from '../../config/app-config-constants';

@Injectable()
export class JenkinsService {
  private repoNames: string[];
  private options: RequestOptions;

  constructor(private http: Http) {
    this.repoNames = [];
    this.options = new RequestOptions({
      headers: new Headers({'Authorization': 'Basic ' + window.btoa(GITHUB_USER + ':' + GITHUB_TOKEN)})
    });
  }

  loadRepos() {
    return this.http.get('https://api.github.com/teams/' + GITHUB_TEAM_ID + '/repos?per_page=100', this.options)
      .toPromise()
      .then((response) => {
        const repos = response.json();
        const reposNoForks = repos.filter((repo) => { return repo.owner.login === 'blackbaud'; });
        this.repoNames = reposNoForks
          .map((repo) => { return repo.name; })
          .reduce((map, repoName) => {
            map[repoName] = repoName;
            return map;
          }, {});
      });
  }

  getActionItems(): Promise<ActionItem[]> {
    const envPromises = [];
    const newActionItems: ActionItem[] = [];
    JENKINS_ENV.forEach((url) => {
      const promise = this.http.get(
        url + 'api/json?tree=jobs[name,lastCompletedBuild[number,duration,timestamp,result,url]]', this.options)
        .toPromise()
        .then((response) => this.processJobs(response, newActionItems))
        .catch(this.handleError);
      envPromises.push(promise);
    });
    return new Promise<ActionItem[]>((resolve) => {
      Promise.all(envPromises).then(() => {
        resolve(newActionItems);
      });
    });
  }

  private processJobs(response, newActionItems) {
      const jobs = response.json().jobs;
      jobs.forEach((job) => this.addNewActionItem(job, newActionItems));
  }

  private addNewActionItem(job, newActionItems) {
    const lastCompletedBuild = job.lastCompletedBuild;
    if (lastCompletedBuild) {
      const jobName = job.name;
      const jobNameToBuildName = jobName.substring(0, jobName.indexOf('_'));
      const jobType = jobName.substring(jobName.indexOf('_') + 1, jobName.length);
      const jobStatus = lastCompletedBuild.result;
      if (jobType !== 'release' && this.repoNames[jobNameToBuildName] && jobStatus === 'FAILURE') {
        const jobUrl = lastCompletedBuild.url;
        const buildTimestamp = lastCompletedBuild.timestamp;
        const jobDetails = new JobDetails();
        jobDetails.result = jobStatus;
        jobDetails.jobName = jobName;
        jobDetails.timestamp = buildTimestamp;
        jobDetails.building = jobStatus === JENKINS_BUILD_SUCCESS_STRING;
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
