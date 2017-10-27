import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { ActionItem, GitHubPullRequest, PullRequest } from '../../domain/action-item';
import { ConfigService } from '../../app/config.service';
import { DO_NOT_MERGE_LABEL_NAME } from './github.constants';

@Injectable()
export class GithubService {

  constructor(private http: Http, private configService: ConfigService) {}

  loadRepos() {
    if (!this.configService.github.isConfigured()) {
      return this.handleError('Ignoring GitHub calls since not configured');
    }
    const mfGithubTeamId = this.configService.github.teamId;
    return this.http.get('https://api.github.com/teams/' + mfGithubTeamId + '/repos?per_page=100', this.configService.options)
      .toPromise()
      .then((response) => {
        const repos = response.json();
        const reposNoForks = repos.filter((repo) => {
          return repo.owner.login === 'blackbaud';
        });
        this.configService.repos = reposNoForks
          .map((repo) => {
            return repo.name;
          })
          .reduce((map, repoName) => {
            map[repoName] = repoName;
            return map;
          }, {});
      });
  }

  getActionItems(): Promise<PullRequest[]> {
    if (!this.configService.github.isConfigured()) {
      return this.handleError('Ignoring GitHub calls since not configured');
    }
    const mfGithubTeam = this.configService.github.team;
    const mfGithubUsername = this.configService.github.userName;
    const mfGithubToken = this.configService.github.token;
    const headers = new Headers({'Authorization': 'Basic ' + window.btoa(mfGithubUsername + ':' + mfGithubToken)});
    const options = new RequestOptions({headers: headers});
    return this.http.get('https://api.github.com/search/issues?q=is:open+is:pr+team:' + mfGithubTeam, options)
      .toPromise()
      .then(response => response.json().items.map((item => new GitHubPullRequest(item))))
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    // ignore failure so that Promise.All() in calling component can resolve successful calls
    return Promise.resolve({});
  }
}
