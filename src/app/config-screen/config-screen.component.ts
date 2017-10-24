import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VSTS_REPOS } from '../../github/services/vsts-repos';
import { ConfigService } from '../../config/config.service';

@Component({
  selector: 'mf-config-screen',
  templateUrl: './config-screen.component.html',
  styleUrls: ['./config-screen.component.css']
})
export class ConfigScreenComponent implements OnInit {
  constructor(public configService: ConfigService, private router: Router) {
  }

  ngOnInit() {
    this.configService.loadConfigFromStorage();
  }

  get teams() {
    return Object.keys(VSTS_REPOS);
  }

  getVstsConfigValue(key) {
    return this.getConfigValue('vsts', key);
  }

  getGitHubConfigValue(key) {
    return this.getConfigValue('github', key);
  }

  getConfigValue(type, key) {
    return this.configService.getConfigValue(type, key);
  }

  setVstsConfigValue(key, value) {
    this.setConfigValue('vsts', key, value);
  }

  setGitHubConfigValue(key, value) {
    this.setConfigValue('github', key, value);
  }

  setConfigValue(type, key, val): void {
    this.configService.setConfigValue(type, key, val);
  }

  saveConfig(): void {
    this.configService.saveConfig();
    this.router.navigate(['/']);
  }
}
