import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VSTS_REPOS } from '../../github/services/vsts-repos';
import { ConfigService } from '../config.service';

@Component({
  selector: 'mf-config-screen',
  templateUrl: './config-screen.component.html',
  styleUrls: ['./config-screen.component.css']
})
export class ConfigScreenComponent  {
  constructor(public configService: ConfigService, private router: Router) {
  }

  get teams() {
    return Object.keys(VSTS_REPOS);
  }

  getVstsConfigValue(key) {
    return this.configService.getVstsConfigValue(key);
  }

  getGitHubConfigValue(key) {
    return this.configService.getGitHubConfigValue(key);
  }
  setVstsConfigValue(key, value) {
    this.configService.setVstsConfigValue(key, value);
  }

  setGitHubConfigValue(key, value) {
    this.configService.setGitHubConfigValue(key, value);
  }

  saveConfig(): void {
    this.configService.saveConfig();
    this.router.navigate(['/']);
  }
}
