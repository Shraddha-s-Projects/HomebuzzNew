import { TestBed } from '@angular/core/testing';

import { MyLikesService } from './my-likes.service';

describe('MyLikesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyLikesService = TestBed.get(MyLikesService);
    expect(service).toBeTruthy();
  });
});
