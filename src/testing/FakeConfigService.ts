import {GithubConfig} from '../domain/github-config';
export class FakeConfigService {
    githubConfig = new GithubConfig();
    configured = false;
    updating = false;
    public boardUpdating = { isIt: this.updating };
    public getConfig(): GithubConfig {
        return this.githubConfig;
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
}
