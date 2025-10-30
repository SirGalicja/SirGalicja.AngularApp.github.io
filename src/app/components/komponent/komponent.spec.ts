import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Komponent } from './komponent';

describe('Komponent', () => {
  let component: Komponent;
  let fixture: ComponentFixture<Komponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Komponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Komponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
