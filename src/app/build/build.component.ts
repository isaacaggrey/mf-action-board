import { Component, Input } from '@angular/core';
import { Build } from '../../domain/action-item';
import { PullRequestComponent } from '../pull-request/pull-request.component';
import * as moment from 'moment';

@Component({
  selector: 'mf-build',
  templateUrl: './build.component.html',
  styleUrls: ['./build.component.css']
})
export class BuildComponent {
  @Input()
  build: Build;

  getTimeElapsed(time) {
    return moment(time).fromNow();
  }

  get cssClasses(): String[] {
    const classes = [this.priorityClass];
    if (this.build.building) {
      classes.push('progress-bar', 'progress-bar-striped', 'active');
    }
    return classes;
  }

  get priorityClass(): String {
    const priority = this.build.priority;
    switch (priority) {
      case 1: {
        return PullRequestComponent.RED;
      }
      case 2: {
        return PullRequestComponent.ORANGE;
      }
      case 3: {
        return PullRequestComponent.YELLOW;
      }
      case 4: {
        return PullRequestComponent.GREY;
      }
      default: {
        return '';
      }
    }
  }

}
