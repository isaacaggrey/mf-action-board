import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Job } from '../../domain/job';
import { JobDetails } from "../../domain/jobDetails";
import { ActionItem } from "../../domain/action-item";

@Injectable()
export class JenkinsService {

  public jenkinsJobs: string[] = [];
  public baseUrl: string = 'https://jenkins-oscf-sandbox.blackbaudcloud.com';

  constructor(private http: Http) {
    this.setJenkinsJobs();
  }

  setJenkinsJobs(): void {
    this.jenkinsJobs.push('lo-groups_build');
  }


  getBuilds(): Promise<Job[]> {
    const headers = new Headers({ 'Authorization': 'Basic ' + window.btoa('blackbaud-shafathrehman:4980e8b6a1826e27183760fc4fb126c8') });
    const options = new RequestOptions({ headers: headers });
    return this.http.get( this.baseUrl +'/api/json', options)
      .toPromise()
      .then(response => response.json().jobs as Job[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  getJenkinsJobDetails(jobUrls: String[]) {
    jobUrls.forEach(this.getSingleJobDetail)

  }

  public getSingleJobDetail(jobUrl: string): Promise<ActionItem> {
    const headers = new Headers({ 'Authorization': 'Basic ' + window.btoa('blackbaud-shafathrehman:4980e8b6a1826e27183760fc4fb126c8') });
    const options = new RequestOptions({ headers: headers });
    return this.http.get( this.baseUrl + '/job/' + jobUrl + '/lastBuild/api/json', options)
      .toPromise()
      .then(response => {
        let jobDetails = new JobDetails();
        jobDetails.result = response.json().result;
        jobDetails.timestamp = response.json().timestamp;
        jobDetails.jobName = jobUrl;
        return this.convertToActionItem(jobDetails);
      })
      .catch(this.handleError);
  }

  private convertToActionItem(jobDetails:any):ActionItem {
    return {
      name: jobDetails.jobName,
      priority: 0,
      type: 'build',
      source: 'jennkins',
      created: 0
    };
  }
}
