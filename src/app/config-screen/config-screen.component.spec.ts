import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigScreenComponent } from './config-screen.component';

describe('ConfigScreenComponent', () => {
  let component: ConfigScreenComponent;
  let fixture: ComponentFixture<ConfigScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
