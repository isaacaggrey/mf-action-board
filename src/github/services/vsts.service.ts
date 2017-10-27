import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

import { ConfigService } from '../../app/config.service';
import { VSTS_REPOS } from './vsts-repos';
import { ActionItem, VstsPullRequest, PullRequest, Build, VstsBuild} from '../../domain/action-item';

@Injectable()
export class VstsService {
  ACCOUNT = 'blackbaud';
  COLLECTION = 'DefaultCollection';
  VERSION = '2.0';
  PROJECT = 'Products';
  ROOTURL = `https://${this.ACCOUNT}.VisualStudio.com/${this.COLLECTION}/${this.PROJECT}`;

  constructor(private http: Http, private configService: ConfigService) {
  }

  getActionItems(): Promise<ActionItem[]> {
    return Promise.all([this.getFailedBuilds(), this.getPullRequests()]).then(items => [].concat.apply([], items));
  }

  getFailedBuilds(): Promise<ActionItem[]> {
    return this.getBuilds()
      .then(builds => builds.filter(this.isFailedBuild))
      .then(failedBuildInfo => failedBuildInfo.map(info => new VstsBuild(info)));
  }

  private isFailedBuild(info: any): boolean {
    return info !== undefined && info.result !== 'succeeded';
  }

  getBuilds(): Promise<any> {
    return this.getBuildIds()
      .then(ids => ids.filter(id => id !== null))
      .then(ids => {
        const promises = ids.map(this.getLastMasterBuild.bind(this));
        return Promise.all(promises).then(builds => [].concat.apply([], builds));
      });
  }

  getLastMasterBuild(definition_id: number): Promise<any> {
    if (!this.configService.vsts.isConfigured()) {
      return this.handleError('Ignoring VSTS calls since not configured');
    }
    return this.http.get(this.buildsUrl(definition_id), this.requestOptions)
      .toPromise()
      .then(response => response.json().value)
      .then(builds => builds.filter(build => build.sourceBranch === 'refs/heads/master'))
      // this assumes that the response in reverse cronological order,
      // which isn't explicitly stated in the docs, but seems empirically true.
      .then(builds => builds[0]);
  }

  getBuildIds(): Promise<number[]> {
    if (!this.configService.vsts.isConfigured()) {
      return this.handleError('Ignoring VSTS calls since not configured');
    }
    const promises: Promise<number>[] = this.repos.map(repo => {
      return this.http.get(this.buildDefinitionsUrl(repo), this.requestOptions)
        .toPromise()
        .then(response => response.json())
        .then(response => (response.count === 1) ? response.value[0].id : null);
    });
    return Promise.all(promises);
  }

  getPullRequests(): Promise<ActionItem[]> {
    if (!this.configService.vsts.isConfigured()) {
      return this.handleError('Ignoring VSTS calls since not configured');
    }
    const promises: Promise<VstsPullRequest[]>[] = this.repos.map(repo => {
      return this.http.get(this.prUrl(repo), this.requestOptions)
        .toPromise()
        .then(response => response.json().value.map((item => new VstsPullRequest(item))))
        .catch(this.handleError);
    });
    return Promise.all(promises).then(prPromiseResults => [].concat.apply([], prPromiseResults));
  }

  private get requestOptions(): RequestOptions {
    const username = this.configService.vsts.username;
    const token = this.configService.vsts.token;
    const authToken = window.btoa(`${username}:${token}`);
    const headers = new Headers({'Authorization': `Basic ${authToken}`});
    return new RequestOptions({headers: headers});
  }

  private get repos() {
    return VSTS_REPOS[this.configService.vsts.team];
  }

  private handleError(error: any, errorResult = {}): Promise<any> {
    console.error('An error occurred', error);
    // ignore failure so that Promise.All() in calling component can resolve successful calls
    return Promise.resolve(errorResult);
  }

  private last_month() {
    return moment().subtract(1, 'month');
  }

  private prUrl(repo): string {
    return `${this.ROOTURL}/_apis/git/repositories/${repo}/pullRequests?api-version=${this.VERSION}`;
  }

  private buildDefinitionsUrl(repo): string {
    return `${this.ROOTURL}/_apis/build/definitions/?api-version=${this.VERSION}&name=${repo}`;
  }

  private buildsUrl(definition_id: number): string {
    const root = `${this.ROOTURL}/_apis/build/builds/?api-version=${this.VERSION}`;
    return `${root}&definitions=${definition_id}&minFinishTime=${this.last_month().format()}`;
  }
}
