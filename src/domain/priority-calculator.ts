import { ActionItem } from "./action-item";

export class PriorityCalculator {

    static GITHUB_ACTION_ITEM_SLA : number = 14400000;
    static JENKINS_ACTION_ITEM_SLA : number = 43200000;

    static calculatePriority(actionItem : ActionItem) : ActionItem {
        if (actionItem.source == 'github') {
            this.calculatePriorityForGitHubActionItem(actionItem);
        } else if (actionItem.source == 'jenkins') {
            this.calculatePriorityForJenkinsActionItem(actionItem);
        }
        return actionItem;
    }

    static calculatePriorityForGitHubActionItem(actionItem : ActionItem) {
        let timeElapsed = Date.now() - actionItem.created;
        if (timeElapsed >= this.GITHUB_ACTION_ITEM_SLA) {
            actionItem.priority = 1;
        } else if (timeElapsed >= (this.GITHUB_ACTION_ITEM_SLA/2)) {
            actionItem.priority = 2;
        } else {
            actionItem.priority = 3;
        }
    }

    static calculatePriorityForJenkinsActionItem(actionItem : ActionItem) {
        let timeElapsed = Date.now() - actionItem.created;
        if (timeElapsed >= this.JENKINS_ACTION_ITEM_SLA) {
            actionItem.priority = 1;
        } else if (timeElapsed >= (this.JENKINS_ACTION_ITEM_SLA/2)) {
            actionItem.priority = 2;
        } else {
            actionItem.priority = 3;
        }
    }
}