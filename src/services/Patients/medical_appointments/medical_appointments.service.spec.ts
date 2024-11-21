import { Test, TestingModule } from '@nestjs/testing';
import { MedicalAppointmentsService } from './medical_appointments.service';

describe('MedicalAppointmentsService', () => {
  let service: MedicalAppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalAppointmentsService],
    }).compile();

    service = module.get<MedicalAppointmentsService>(MedicalAppointmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
