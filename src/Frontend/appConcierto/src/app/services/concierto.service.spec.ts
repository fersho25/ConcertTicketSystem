import { TestBed } from '@angular/core/testing';

import { ConciertoService } from './concierto.service';

describe('ConciertoService', () => {
  let service: ConciertoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConciertoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
