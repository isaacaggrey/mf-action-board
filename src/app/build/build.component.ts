import { Component, Input } from '@angular/core';
import { Build } from '../../domain/action-item';
import { ActionItemComponent } from '../action-item/action-item.component';

@Component({
  selector: 'mf-build',
  templateUrl: './build.component.html',
  styleUrls: ['./build.component.css']
})
export class BuildComponent extends ActionItemComponent {
  @Input()
  build: Build;

  get cssClasses(): String[] {
    const classes = [this.priorityClass];
    if (this.build.building) {
      classes.push('progress-bar', 'progress-bar-striped', 'active');
    }
    return classes;
  }

  get priorityClass(): String {
    return this.calcPriorityClass(this.build.priority)
  }

}
