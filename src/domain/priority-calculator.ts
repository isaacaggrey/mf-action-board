import { ActionItem } from './action-item';
import { GITHUB_PR_SLA_MS } from '../config/app-config-constants';
import { JENKINS_ACTION_ITEM_SLA_MS } from '../config/app-config-constants';

export class PriorityCalculator {

    static GITHUB_ACTION_ITEM_SLA: number = GITHUB_PR_SLA_MS;
    static JENKINS_ACTION_ITEM_SLA: number = JENKINS_ACTION_ITEM_SLA_MS;

    static calculatePriority(actionItem: ActionItem): ActionItem {
        if (actionItem.source === 'github') {
            this.calculatePriorityForGitHubActionItem(actionItem);
        } else if (actionItem.source === 'jenkins') {
            this.calculatePriorityForJenkinsActionItem(actionItem);
        }
        return actionItem;
    }

    static calculatePriorityForGitHubActionItem(actionItem: ActionItem) {
        const timeElapsed = Date.now() - actionItem.created;
        if (timeElapsed >= this.GITHUB_ACTION_ITEM_SLA) {
            actionItem.priority = 1;
        } else if (timeElapsed >= (this.GITHUB_ACTION_ITEM_SLA / 2)) {
            actionItem.priority = 2;
        } else {
            actionItem.priority = 3;
        }
    }

    static calculatePriorityForJenkinsActionItem(actionItem: ActionItem) {
        const timeElapsed = Date.now() - actionItem.created;
        if (timeElapsed >= this.JENKINS_ACTION_ITEM_SLA) {
            actionItem.priority = 1;
        } else if (timeElapsed >= (this.JENKINS_ACTION_ITEM_SLA / 2)) {
            actionItem.priority = 2;
        } else {
            actionItem.priority = 3;
        }
    }
}
