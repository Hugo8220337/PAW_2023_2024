import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEntityComponent } from './register-entity.component';

describe('RegisterEntityComponent', () => {
  let component: RegisterEntityComponent;
  let fixture: ComponentFixture<RegisterEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterEntityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
