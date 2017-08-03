import { Injectable } from '@angular/core';
import { GithubConfig } from '../domain/github-config';
import { MF_GITHUB_TEAM, MF_GITHUB_TEAM_ID, MF_GITHUB_TOKEN, MF_GITHUB_USERNAME } from './app-config-constants';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ConfigService {
  githubConfig = new GithubConfig();
  private appLastModified = new Date();
  public boardUpdating = { isIt: false };
  constructor(private http: Http) {
  }

  public getConfig(): GithubConfig {
    return this.githubConfig;
  }

  public isConfigured() {
    return this.githubConfig.team
      && this.githubConfig.teamId
      && this.githubConfig.userName
      && this.githubConfig.token;
  }

  public loadConfigFromStorage(): void {
    this.githubConfig.team = localStorage.getItem(MF_GITHUB_TEAM);
    this.githubConfig.teamId = localStorage.getItem(MF_GITHUB_TEAM_ID);
    this.githubConfig.userName = localStorage.getItem(MF_GITHUB_USERNAME);
    this.githubConfig.token = localStorage.getItem(MF_GITHUB_TOKEN);
  }

  public saveConfig(): void {
    if (this.githubConfig.team) {
      localStorage.setItem(MF_GITHUB_TEAM, this.githubConfig.team);
    }
    if (this.githubConfig.teamId) {
      localStorage.setItem(MF_GITHUB_TEAM_ID, this.githubConfig.teamId);
    }
    if (this.githubConfig.userName) {
      localStorage.setItem(MF_GITHUB_USERNAME, this.githubConfig.userName);
    }
    if (this.githubConfig.token) {
      localStorage.setItem(MF_GITHUB_TOKEN, this.githubConfig.token);
    }
  }

  public checkForRefresh() {
    const siteUrl = window.location.href;
    this.http.head(siteUrl)
      .map(response => response.headers.get('Last-Modified'))
      .subscribe(lastModifiedHeader => {
        if (this.isTimeToRefreshPage(this.appLastModified, new Date(lastModifiedHeader))) {
          this.boardUpdating.isIt = true;
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
      });
  }

  private isTimeToRefreshPage(appLastModified: Date, lastModifiedHeader: Date) {
    return appLastModified && appLastModified.getTime() < lastModifiedHeader.getTime();
  }
}
