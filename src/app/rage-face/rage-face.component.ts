import { Component, Input } from '@angular/core';

@Component({
  selector: 'mf-rage-face',
  templateUrl: './rage-face.component.html',
  styleUrls: ['./rage-face.component.css']
})
export class RageFaceComponent {
  @Input()
  priority: number;

  get imgSrc() {
    let color = 'yellow';
    if (this.priority === 1) {
      color = 'red';
    } else if (this.priority === 2) {
      color = 'orange';
    }
    return `../assets/${color}-face.png`;
  }
}
