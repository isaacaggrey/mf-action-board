import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActionItem } from '../domain/action-item';

@Component({
    selector: 'action-items',
    templateUrl: './action-items.component.html',
    styleUrls: ['./action-items.component.css']
})
export class ActionItemsComponent {
    actionItems: ActionItem[];

    constructor() {}

    ngOnInit() {
        this.getActionItemsList();
        setInterval(() => {
          this.getActionItemsList();
        }, 10000);
    }

    getActionItemsList(): void {
        this.actionItems = [{
            name: "group-member-monitor-build",
            priority: 3,
            type: "Jenkins Build - Building",
            source: "jenkins",
            created: new Date().getTime()
        },{
            name: "bluemoon-core-build",
            priority: 2,
            type: "Jenkins Build - Broken",
            source: "jenkins",
            created: new Date().getTime()
        },{
            name: "LUM-1234-fixed-stuff",
            priority: 1,
            type: "Github Pull Request",
            source: "github",
            created: new Date().getTime()
        }];
        this.actionItems = this.sortByPriorityAndOpenDuration(this.actionItems);
    }

    sortByPriorityAndOpenDuration(actionItems: ActionItem[]) : ActionItem[] {
        let red = actionItems.filter(function(a) {
            return a.priority == 1;
        });

        let yellow = actionItems.filter(function(a) {
            return a.priority == 2;
        });

        let green = actionItems.filter(function(a) {
            return a.priority == 3;
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
