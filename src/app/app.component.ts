import { Component } from '@angular/core';
import { APP_LABELS } from './app.constants';

@Component({
  selector: 'mf-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = APP_LABELS.TITLE;
}
