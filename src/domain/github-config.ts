export class GithubConfig {
  team: string;
  teamId: string;
  userName: string;
  token: string;

  public isConfigured(): boolean {
    return Boolean(this.team) && Boolean(this.teamId) && Boolean(this.userName) && Boolean(this.token);
  }
}
