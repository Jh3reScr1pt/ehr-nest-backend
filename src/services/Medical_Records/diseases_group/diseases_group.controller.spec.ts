import { Test, TestingModule } from '@nestjs/testing';
import { DiseasesGroupController } from './diseases_group.controller';
import { DiseasesGroupService } from './diseases_group.service';

describe('DiseasesGroupController', () => {
  let controller: DiseasesGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiseasesGroupController],
      providers: [DiseasesGroupService],
    }).compile();

    controller = module.get<DiseasesGroupController>(DiseasesGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
