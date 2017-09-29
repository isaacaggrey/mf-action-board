import { Injectable } from '@angular/core';
import { GithubConfig } from '../domain/github-config';
import { VstsConfig } from '../domain/vsts-config';
import { MF_GITHUB_TEAM, MF_GITHUB_TEAM_ID,
  MF_GITHUB_TOKEN, MF_GITHUB_USERNAME,
  MF_VSTS_USERNAME, MF_VSTS_TOKEN, MF_VSTS_TEAM } from './app-config-constants';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ConfigService {
  githubConfig = new GithubConfig();
  private vstsConfig = new VstsConfig();
  private appLastModified = new Date();
  public repos;
  public options: RequestOptions;
  public boardUpdating = { isIt: false };
  constructor(private http: Http) {
  }

  public get github(): GithubConfig {
    return this.githubConfig;
  }

  public get vsts(): VstsConfig {
    return this.vstsConfig;
  }

  public isConfigured() {
    return this.githubConfig.isConfigured() || this.vstsConfig.isConfigured();
  }

  public loadConfigFromStorage(): void {
    this.githubConfig.team = localStorage.getItem(MF_GITHUB_TEAM);
    this.githubConfig.teamId = localStorage.getItem(MF_GITHUB_TEAM_ID);
    this.githubConfig.userName = localStorage.getItem(MF_GITHUB_USERNAME);
    this.githubConfig.token = localStorage.getItem(MF_GITHUB_TOKEN);
    this.vstsConfig.username = localStorage.getItem(MF_VSTS_USERNAME);
    this.vstsConfig.token = localStorage.getItem(MF_VSTS_TOKEN);
    this.vstsConfig.team = localStorage.getItem(MF_VSTS_TEAM);
    this.options = new RequestOptions({
      headers: new Headers({'Authorization': 'Basic ' + window.btoa(this.githubConfig.userName + ':' + this.githubConfig.token)})
    });
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
    if (this.vstsConfig.username) {
      localStorage.setItem(MF_VSTS_USERNAME, this.vstsConfig.username);
    }
    if (this.vstsConfig.token) {
      localStorage.setItem(MF_VSTS_TOKEN, this.vstsConfig.token);
    }
    if (this.vstsConfig.team) {
      localStorage.setItem(MF_VSTS_TEAM, this.vstsConfig.team);
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

  public setConfigValue(type: string, key: string, value: string) {
    if (type === 'vsts') {
      this.vstsConfig[key] = value;
    } else {
      this.githubConfig[key] = value;
    }
  }

  public getConfigValue(type: string, key: string) {
    if (type === 'vsts') {
      return this.vstsConfig[key];
    } else {
      return this.githubConfig[key];
    }
  }
}
