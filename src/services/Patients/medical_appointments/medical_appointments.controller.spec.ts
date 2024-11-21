import { Test, TestingModule } from '@nestjs/testing';
import { MedicalAppointmentsController } from './medical_appointments.controller';
import { MedicalAppointmentsService } from './medical_appointments.service';

describe('MedicalAppointmentsController', () => {
  let controller: MedicalAppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalAppointmentsController],
      providers: [MedicalAppointmentsService],
    }).compile();

    controller = module.get<MedicalAppointmentsController>(MedicalAppointmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
