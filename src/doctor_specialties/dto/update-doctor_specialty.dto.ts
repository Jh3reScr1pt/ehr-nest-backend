import { PartialType } from '@nestjs/swagger';
import { CreateDoctorSpecialtyDto } from './create-doctor_specialty.dto';

export class UpdateDoctorSpecialtyDto extends PartialType(CreateDoctorSpecialtyDto) {}
