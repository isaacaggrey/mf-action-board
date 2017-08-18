import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { Component } from '@angular/core';
import { APP_LABELS } from './app.constants';

let compiled;
let fixture;

const componentElements = {
  applicationTitle: () => { return compiled.querySelector('h1'); },
};

describe('App Component', () => {
    beforeEach(() => {
      compiled = createComponent();
    });
    it('should render title', () => {
      expect(componentElements.applicationTitle().textContent).toContain(APP_LABELS.TITLE);
    });
});

function createComponent() {
  TestBed.configureTestingModule({
    declarations: [
      AppComponent,
      MockActionItemsComponent
    ]
  }).compileComponents();
  fixture = TestBed.createComponent(AppComponent);
  fixture.detectChanges();
  return fixture.debugElement.nativeElement;
}


@Component({
  selector: 'mf-action-items',
  template: ''
})
class MockActionItemsComponent {}

