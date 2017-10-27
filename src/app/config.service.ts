import { Injectable } from '@angular/core';
import { GithubConfig } from '../domain/github-config';
import { VstsConfig } from '../domain/vsts-config';
import { CONFIG } from './app.constants';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ConfigService {
  private githubConfig: GithubConfig;
  private vstsConfig: VstsConfig;
  public repos;
  public options: RequestOptions;
  constructor(private http: Http) {
    this.githubConfig = new GithubConfig();
    this.vstsConfig = new VstsConfig();
    this.loadConfigFromStorage();
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

  private loadConfigFromStorage(): void {
    this.githubConfig.team = localStorage.getItem(CONFIG.GITHUB.TEAM);
    this.githubConfig.teamId = localStorage.getItem(CONFIG.GITHUB.TEAM_ID);
    this.githubConfig.userName = localStorage.getItem(CONFIG.GITHUB.USERNAME);
    this.githubConfig.token = localStorage.getItem(CONFIG.GITHUB.TOKEN);
    this.vstsConfig.username = localStorage.getItem(CONFIG.VSTS.USERNAME);
    this.vstsConfig.token = localStorage.getItem(CONFIG.VSTS.TOKEN);
    this.vstsConfig.team = localStorage.getItem(CONFIG.VSTS.TEAM);
    this.options = new RequestOptions({
      headers: new Headers({'Authorization': 'Basic ' + window.btoa(this.githubConfig.userName + ':' + this.githubConfig.token)})
    });
  }

  public saveConfig(): void {
    if (this.githubConfig.team) {
      localStorage.setItem(CONFIG.GITHUB.TEAM, this.githubConfig.team);
    }
    if (this.githubConfig.teamId) {
      localStorage.setItem(CONFIG.GITHUB.TEAM_ID, this.githubConfig.teamId);
    }
    if (this.githubConfig.userName) {
      localStorage.setItem(CONFIG.GITHUB.USERNAME, this.githubConfig.userName);
    }
    if (this.githubConfig.token) {
      localStorage.setItem(CONFIG.GITHUB.TOKEN, this.githubConfig.token);
    }
    if (this.vstsConfig.username) {
      localStorage.setItem(CONFIG.VSTS.USERNAME, this.vstsConfig.username);
    }
    if (this.vstsConfig.token) {
      localStorage.setItem(CONFIG.VSTS.TOKEN, this.vstsConfig.token);
    }
    if (this.vstsConfig.team) {
      localStorage.setItem(CONFIG.VSTS.TEAM, this.vstsConfig.team);
    }
  }

  public setConfigValue(type: string, key: string, value: string) {
    if (type === 'vsts') {
      this.vstsConfig[key] = value;
    } else {
      this.githubConfig[key] = value;
    }
  }

  public getConfigValue(type: string, key: string): string {
    if (type === 'vsts') {
      return this.vstsConfig[key];
    } else {
      return this.githubConfig[key];
    }
  }

  getVstsConfigValue(key) {
    return this.getConfigValue('vsts', key);
  }

  getGitHubConfigValue(key) {
    return this.getConfigValue('github', key);
  }

  setVstsConfigValue(key, value) {
    this.setConfigValue('vsts', key, value);
  }

  setGitHubConfigValue(key, value) {
    this.setConfigValue('github', key, value);
  }
}
