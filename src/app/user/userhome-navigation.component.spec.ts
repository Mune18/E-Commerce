import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserHomeNavigationComponent } from './userhome-navigation.component';

describe('HomeNavigationComponent', () => {
  let component: UserHomeNavigationComponent;
  let fixture: ComponentFixture<UserHomeNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserHomeNavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserHomeNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
