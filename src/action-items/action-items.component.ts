import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActionItem } from '../domain/action-item';
import { GithubService } from "../github/services/github.service";
import { JenkinsService } from "../jenkins/services/jenkins.service";
import * as moment from 'moment';

@Component({
    selector: 'action-items',
    templateUrl: './action-items.component.html',
    styleUrls: ['./action-items.component.css']
})
export class ActionItemsComponent {
    actionItems: ActionItem[];

    constructor(private githubService: GithubService, private jenkinsService: JenkinsService) {}

    ngOnInit() {
        this.getActionItemsList();
        setInterval(() => {
          this.getActionItemsList();
        }, 10000);
    }

    getActionItemsList(): void {
        this.githubService.getActionItems().then(
            actionItems => {
                this.actionItems = this.sortByPriorityAndOpenDuration(Array.prototype.concat.apply([], actionItems));
            }
        );
    }

    getTimeElapsed(time) {
        return moment(time).fromNow();
    }

    sortByPriorityAndOpenDuration(actionItems: ActionItem[]) : ActionItem[] {
        let red = actionItems.filter(function(a) {
            return a.priority === 1;
        });

        let yellow = actionItems.filter(function(a) {
            return a.priority === 2;
        });

        let green = actionItems.filter(function(a) {
            return a.priority === 3;
        });

        return red.sort(this.sortByOpenDuration)
            .concat(yellow.sort(this.sortByOpenDuration))
            .concat(green.sort(this.sortByOpenDuration));
    }

    sortByOpenDuration(a,b) {
        if (a.created > b.created) {
            return 1;
        } else if (a.created < b.created) {
            return -1;
        } else {
            return 0;
        }
    }
}
