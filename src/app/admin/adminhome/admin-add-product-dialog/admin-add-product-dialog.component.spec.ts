import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddProductDialogComponent } from './admin-add-product-dialog.component';

describe('AdminAddProductDialogComponent', () => {
  let component: AdminAddProductDialogComponent;
  let fixture: ComponentFixture<AdminAddProductDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddProductDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminAddProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
