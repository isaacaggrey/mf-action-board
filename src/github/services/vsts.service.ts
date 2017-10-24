import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { ConfigService } from '../../config/config.service';
import { VSTS_REPOS } from './vsts-repos';
import { ActionItem, VstsPullRequest, PullRequest} from '../../domain/action-item';

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
    if (!this.configService.vsts.isConfigured()) {
      return this.handleError('Ignoring VSTS calls since not configured');
    }
    const username = this.configService.vsts.username;
    const token = this.configService.vsts.token;
    const team = this.configService.vsts.team;
    const repos = VSTS_REPOS[team];
    const authToken = window.btoa(`${username}:${token}`);
    const headers = new Headers({'Authorization': `Basic ${authToken}`});
    const options = new RequestOptions({headers: headers});
    const promises: Promise<ActionItem[]>[] = repos.map(repo => {
      return this.http.get(this.prUrl(repo), options)
        .toPromise()
        .then(response => response.json().value.map((item => new VstsPullRequest(item))))
        .catch(this.handleError);
    });
    return Promise.all(promises).then(repoItems => repoItems[0].concat(repoItems[1]));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    // ignore failure so that Promise.All() in calling component can resolve successful calls
    return Promise.resolve({});
  }

  private prUrl(repo): string {
    return `${this.ROOTURL}/_apis/git/repositories/${repo}/pullRequests?api-version=${this.VERSION}`;
  }
}
