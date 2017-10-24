import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintLitComponent } from './sprint-lit.component';

describe('SprintLitComponent', () => {
  let component: SprintLitComponent;
  let fixture: ComponentFixture<SprintLitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprintLitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintLitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
