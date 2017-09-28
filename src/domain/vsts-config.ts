export class VstsConfig {
  username: string;
  token: string;
  team: string; // TODO: make an enum

  public isConfigured() {
    return Boolean(this.username) && Boolean(this.token) && Boolean(this.team);
  }
}
