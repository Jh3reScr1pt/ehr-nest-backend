import { Test, TestingModule } from '@nestjs/testing';
import { DiseasesGroupService } from './diseases_group.service';

describe('DiseasesGroupService', () => {
  let service: DiseasesGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiseasesGroupService],
    }).compile();

    service = module.get<DiseasesGroupService>(DiseasesGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
