import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwinsComponent } from './twins.component';

describe('TwinsComponent', () => {
  let component: TwinsComponent;
  let fixture: ComponentFixture<TwinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
