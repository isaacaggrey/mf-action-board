import { Injectable } from '@angular/core';
import { GithubConfig } from '../domain/github-config';
import { MF_GITHUB_TEAM, MF_GITHUB_TEAM_ID, MF_GITHUB_TOKEN, MF_GITHUB_USERNAME } from './app-config-constants';

@Injectable()
export class ConfigService {
  githubConfig = new GithubConfig();

  public getConfig(): GithubConfig {
    return this.githubConfig;
  }

  public isConfigured() {
    return this.githubConfig.team !== null
      && this.githubConfig.teamId !== null
      && this.githubConfig.userName !== null
      && this.githubConfig.token !== null;
  }

  public loadConfigFromStorage(): void {
    this.githubConfig.team = localStorage.getItem(MF_GITHUB_TEAM);
    this.githubConfig.teamId = localStorage.getItem(MF_GITHUB_TEAM_ID);
    this.githubConfig.userName = localStorage.getItem(MF_GITHUB_USERNAME);
    this.githubConfig.token = localStorage.getItem(MF_GITHUB_TOKEN);
  }

  public resetConfig(): void {
    this.githubConfig.team = null;
    this.githubConfig.teamId = null;
    this.githubConfig.userName = null;
    this.githubConfig.token = null;
    localStorage.clear();
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
}
