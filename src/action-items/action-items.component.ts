import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActionItem } from '../domain/action-item';
import { GithubService } from '../github/services/github.service';
import { JenkinsService } from '../jenkins/services/jenkins.service';
import * as moment from 'moment';
import { GithubConfig } from '../domain/github-config';
import { ACTION_ITEM_POLLING_INTERVAL_IN_MS } from '../config/app-config-constants';
import { ConfigService } from '../config/config.service';

@Component({
  selector: 'action-items',
  templateUrl: './action-items.component.html',
  styleUrls: ['./action-items.component.css']
})
export class ActionItemsComponent implements OnInit {
  actionItems: ActionItem[];
  showEmptyBoardCongrats = false;
  githubConfig: GithubConfig = this.configService.githubConfig;
  pollIntervalHandle;
  isConfiguring: boolean;
  private configActionItems: ActionItem[] = this.loadConfigActionItems();

  constructor(private githubService: GithubService,
              private jenkinsService: JenkinsService,
              private configService: ConfigService) {
  }

  ngOnInit() {
    this.configService.loadConfigFromStorage();
    if (this.configService.isConfigured()) {
      this.isConfiguring = false;
      this.loadActionItems();
    } else {
      this.isConfiguring = true;
      this.loadConfig();
    }
  }

  private loadActionItems() {
    if (this.configService.isConfigured()) {
      this.jenkinsService.loadRepos().then(() => {
        this.getActionItemsList();
        this.pollIntervalHandle = setInterval(() => {
          this.getActionItemsList();
        }, ACTION_ITEM_POLLING_INTERVAL_IN_MS);
      });
    }
  }

  private loadConfig() {
    this.actionItems = this.configActionItems;
  }

  private loadConfigActionItems(): ActionItem[] {
    const configActionItems = [];
    configActionItems.push(this.createConfigActionItem('GitHub Team Name', 'team'));
    configActionItems.push(this.createConfigActionItem('GitHub Team ID', 'teamId'));
    configActionItems.push(this.createConfigActionItem('GitHub User Name', 'userName'));
    configActionItems.push(this.createConfigActionItem('GitHub Token', 'token'));
    return configActionItems;
  }

  private createConfigActionItem(name: string, model: string): ActionItem {
    const configActionItem = new ActionItem();
    configActionItem.name = name;
    configActionItem.created = moment.now();
    configActionItem.priority = 0;
    configActionItem.source = 'config';
    configActionItem.type = 'Open PR';
    configActionItem.model = model;
    return configActionItem;
  }

  saveConfig() {
    this.configService.saveConfig();
    if (this.configService.isConfigured()) {
      this.isConfiguring = false;
    }
    this.loadActionItems();
  }

  changeConfig() {
    this.isConfiguring = true;
    window.clearInterval(this.pollIntervalHandle);
    this.loadConfig();
  }

  getDisplaySaveConfigButton() {
    return this.isConfiguring;
  }

  getDisplayChangeConfigButton() {
    return !this.isConfiguring;
  }

  getActionItemsList(): void {
    Promise.all([this.githubService.getActionItems(), this.jenkinsService.getActionItems()]).then(
      actionItems => {
        this.actionItems = this.sortByPriorityAndOpenDuration(Array.prototype.concat.apply([], actionItems));
        this.checkIfShouldDisplayEmptyBoardCongrats();
      }
    );
  }

  isConfigured() {
    return this.configService.isConfigured();
  }

  getTeamUsingBoard() {
    return this.configService.getConfig().team;
  }

  getTimeElapsed(time) {
    return moment(time).fromNow();
  }

  getProgressBarPercent(percentage) {
    return `${percentage}%`;
  }

  shouldShowEmptyBoardCongrats() {
    return this.showEmptyBoardCongrats;
  }

  sortByPriorityAndOpenDuration(actionItems: ActionItem[]): ActionItem[] {
    const red = actionItems.filter(function (a) {
      return a.priority === 1;
    });

    const orange = actionItems.filter(function (a) {
      return a.priority === 2;
    });

    const yellow = actionItems.filter(function (a) {
      return a.priority === 3;
    });

    const grey = actionItems.filter(function (a) {
      return a.priority === 4;
    });

    return red.sort(this.sortByOpenDuration)
      .concat(orange.sort(this.sortByOpenDuration))
      .concat(yellow.sort(this.sortByOpenDuration))
      .concat(grey.sort(this.sortByOpenDuration));
  }

  sortByOpenDuration(a, b) {
    if (a.created > b.created) {
      return 1;
    } else if (a.created < b.created) {
      return -1;
    } else {
      return 0;
    }
  }

  private checkIfShouldDisplayEmptyBoardCongrats() {
    this.showEmptyBoardCongrats = this.actionItems.length === 0;
  }
}
