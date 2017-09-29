import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActionItem } from '../domain/action-item';
import { GithubService } from '../github/services/github.service';
import { VstsService } from '../github/services/vsts.service';
import { JenkinsService } from '../jenkins/services/jenkins.service';
import * as moment from 'moment';
import { GithubConfig } from '../domain/github-config';
import { ACTION_ITEM_POLLING_INTERVAL_IN_MS } from '../config/app-config-constants';
import { ConfigService } from '../config/config.service';
import { NotificationsService } from '../notifications/services/notifications.service';
import { CONFIG } from './action-items.constants';

@Component({
  selector: 'mf-action-items',
  templateUrl: './action-items.component.html',
  styleUrls: ['./action-items.component.css']
})
export class ActionItemsComponent implements OnInit {
  actionItems: ActionItem[] = [];
  showEmptyBoardCongrats = false;
  githubConfig: GithubConfig = this.configService.githubConfig;
  pollIntervalHandle;
  isConfiguring: boolean;
  isBoardUpdating = this.configService.boardUpdating;
  private configActionItems: ActionItem[] = this.loadConfigActionItems();

  constructor(private githubService: GithubService,
              private vstsService: VstsService,
              private jenkinsService: JenkinsService,
              private configService: ConfigService,
              private notificationsService: NotificationsService) {
  }

  ngOnInit() {
    this.notificationsService.setUpNoties();
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
      this.githubService.loadRepos().then(() => {
        this.getActionItemsList();
        this.pollIntervalHandle = setInterval(() => {
          this.configService.checkForRefresh();
          this.getActionItemsList();
        }, ACTION_ITEM_POLLING_INTERVAL_IN_MS);
      });
    }
  }

  getActionItemsList(): void {
    const promises: Promise<ActionItem[]>[] = [];
    if (this.configService.github.isConfigured()) {
      promises.push(this.githubService.getActionItems());
      promises.push(this.jenkinsService.getActionItems());
    }
    if (this.configService.vsts.isConfigured()) {
      promises.push(this.vstsService.getActionItems());
    }
    Promise.all(promises).then(
      actionItems => {
        const oldActionItems = this.actionItems;
        this.actionItems = this.sortByPriorityAndOpenDuration(Array.prototype.concat.apply([], actionItems));
        const newActionItems = this.getNewActionItems(oldActionItems, this.actionItems);
        this.notificationsService.notifyNewActionItems(newActionItems);
        this.checkIfShouldDisplayEmptyBoardCongrats();
      }
    );
  }

  private getNewActionItems(oldActionItems: ActionItem[], nextActionItems: ActionItem[]) {
    const oldActionItemMap = oldActionItems.reduce((map, actionItem) => {
      map[actionItem.name] = actionItem;
      return map;
    }, {});
    const newActionItems = nextActionItems.filter((actionItem) => {
      return !oldActionItemMap.hasOwnProperty(actionItem.name);
    });
    return newActionItems;
  }

  private loadConfig() {
    this.actionItems = this.configActionItems;
  }

  private loadConfigActionItems(): ActionItem[] {
    const configActionItems = [];
    configActionItems.push(this.createConfigActionItem(CONFIG.GIT_HUB.TEAM, 'github.team'));
    configActionItems.push(this.createConfigActionItem(CONFIG.GIT_HUB.TEAM_ID, 'github.teamId'));
    configActionItems.push(this.createConfigActionItem(CONFIG.GIT_HUB.USER_NAME, 'github.userName'));
    configActionItems.push(this.createConfigActionItem(CONFIG.GIT_HUB.TOKEN, 'github.token'));
    configActionItems.push(this.createConfigActionItem(CONFIG.VSTS.USERNAME, 'vsts.username'));
    configActionItems.push(this.createConfigActionItem(CONFIG.VSTS.TOKEN, 'vsts.token'));
    configActionItems.push(this.createConfigActionItem(CONFIG.VSTS.TEAM, 'vsts.team'));
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

  isConfigured() {
    return this.configService.isConfigured();
  }

  getTeamUsingBoard() {
    return this.configService.vsts.team || this.configService.github.team || 'Unknown';
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
    const red = actionItems.filter((a) => {
      return a.priority === 1;
    });

    const orange = actionItems.filter((a) => {
      return a.priority === 2;
    });

    const yellow = actionItems.filter((a) => {
      return a.priority === 3;
    });

    const grey = actionItems.filter((a) => {
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

  saveConfigValue(key, newValue) {
    const [configType, configName] = key.split('.');
    this.configService.setConfigValue(configType, configName, newValue);
  }

  getConfigValue(key) {
    const [configType, configName] = key.split('.');
    return this.configService.getConfigValue(configType, configName);
  }

  private checkIfShouldDisplayEmptyBoardCongrats() {
    this.showEmptyBoardCongrats = this.actionItems.length === 0;
  }
}
