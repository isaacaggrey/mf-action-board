import {GithubConfig} from '../domain/github-config';
import {VstsConfig} from '../domain/vsts-config';

// TODO extend the real config service so there's not so much duplicate code
export class FakeConfigService {
    githubConfig = new GithubConfig();
    vstsConfig = new VstsConfig();
    configured = false;
    updating = false;
    public boardUpdating = { isIt: this.updating };
    public get github(): GithubConfig {
        return this.githubConfig;
    }

    public get vsts(): VstsConfig {
      return this.vstsConfig;
    }

    public isConfigured() {
        return this.configured;
    }

    public loadConfigFromStorage(): void {
    }

    public saveConfig(): void {
    }

    public checkForRefresh() {
    }

    private isTimeToRefreshPage() {
        return true;
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
