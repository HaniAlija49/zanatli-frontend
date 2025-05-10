import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorsSearchComponent } from './contractors-search.component';

describe('ContractorsSearchComponent', () => {
  let component: ContractorsSearchComponent;
  let fixture: ComponentFixture<ContractorsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractorsSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractorsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
