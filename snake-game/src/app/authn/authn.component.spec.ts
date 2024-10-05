import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthnComponent } from './authn.component';

describe('AuthnComponent', () => {
  let component: AuthnComponent;
  let fixture: ComponentFixture<AuthnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
