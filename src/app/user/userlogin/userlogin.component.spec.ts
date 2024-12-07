import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserLoginComponent } from './userlogin.component';

describe('UserloginComponent', () => {
  let component:UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
