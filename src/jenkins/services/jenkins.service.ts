import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { JobDetails } from '../../domain/jobDetails';
import { ActionItem } from '../../domain/action-item';
import { PriorityCalculator } from '../../domain/priority-calculator';
import { Headers, RequestOptions } from '@angular/http';

import {
  JENKINS_JOB_BUILDING_COLOR, JENKINS_ENV
} from '../../config/app-config-constants';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class JenkinsService {
  private repoNames: string[];
  private options: RequestOptions;

  constructor(private http: Http, private configService: ConfigService) {
    this.repoNames = [];
  }

  private init() {
    const mfGithubUsername = this.configService.getConfig().userName;
    const mfGithubToken = this.configService.getConfig().token;
    this.options = new RequestOptions({
      headers: new Headers({'Authorization': 'Basic ' + window.btoa(mfGithubUsername + ':' + mfGithubToken)})
    });
  }

  loadRepos() {
    this.init();
    const mfGithubTeamId = this.configService.getConfig().teamId;
    return this.http.get('https://api.github.com/teams/' + mfGithubTeamId + '/repos?per_page=100', this.options)
      .toPromise()
      .then((response) => {
        const repos = response.json();
        const reposNoForks = repos.filter((repo) => {
          return repo.owner.login === 'blackbaud';
        });
        this.repoNames = reposNoForks
          .map((repo) => {
            return repo.name;
          })
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
        url + 'api/json?tree=jobs[name,color,inQueue,lastCompletedBuild[number,duration,timestamp,result,url]]',
        this.options)
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
      if (this.includeJob(job)) {
        const jobStatus = lastCompletedBuild.result;
        const jobDetails = new JobDetails();
        jobDetails.result = jobStatus;
        jobDetails.jobName = job.name;
        jobDetails.timestamp = lastCompletedBuild.timestamp;
        jobDetails.building = this.isBuilding(job);
        jobDetails.url = lastCompletedBuild.url;
        newActionItems.push(this.convertToActionItem(jobDetails));
      }
    }
  }

  private isBuilding(job) {
    return job.inQueue || job.color === JENKINS_JOB_BUILDING_COLOR;
  }

  private includeJob(job) {
    const jobName = job.name;
    const jobType = jobName.substring(jobName.indexOf('_') + 1, jobName.length);
    const jobNameToBuildName = jobName.substring(0, jobName.indexOf('_'));
    return jobType !== 'release'
      && job.color !== 'disabled'
      && this.repoNames[jobNameToBuildName]
      && job.lastCompletedBuild.result === 'FAILURE';
  }

  private convertToActionItem(jobDetails: JobDetails): ActionItem {
    return PriorityCalculator.calculatePriority({
      name: jobDetails.jobName,
      priority: 0,
      type: this.buildTypeString(jobDetails),
      source: 'jenkins',
      created: new Date(jobDetails.timestamp).getTime(),
      url: jobDetails.url,
      building: jobDetails.building
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
