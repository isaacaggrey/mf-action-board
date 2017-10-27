import { PRIORITY } from '../app.constants';
import * as moment from 'moment';

export abstract class ActionItemComponent {
  calcPriorityClass(priority: number): String {
    switch (priority) {
      case 1: {
        return PRIORITY.RED;
      }
      case 2: {
        return PRIORITY.ORANGE;
      }
      case 3: {
        return PRIORITY.YELLOW;
      }
      case 4: {
        return PRIORITY.GREY;
      }
      default: {
        return '';
      }
    }
  }

  getTimeElapsed(time) {
    return moment(time).fromNow();
  }
}
