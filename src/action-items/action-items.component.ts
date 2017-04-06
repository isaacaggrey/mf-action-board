import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActionItem } from '../domain/action-item';

@Component({
  selector: 'action-items',
  templateUrl: './action-items.component.html',
  styleUrls: ['./action-items.component.css']
})
export class ActionItemsComponent {
  actionItems:ActionItem[];

  constructor() {
  }

  ngOnInit() {
    this.actionItems = [{
      name: "test 1",
      priority: 1,
      type: "job",
      source: "jenkins",
      created: new Date().getTime()
    }, {
      name: "test 2",
      priority: 2,
      type: "job",
      source: "jenkins",
      created: new Date().getTime()
    }, {
      name: "test 3",
      priority: 3,
      type: "pr",
      source: "github",
      created: new Date().getTime()
    }];
  }
}
