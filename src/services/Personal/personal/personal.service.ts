import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PersonalService {
  constructor(private prismaService: PrismaService) {}

  private validateCreatePersonalDto(createPersonalDto: CreatePersonalDto) {
    const fields = [
      { field: 'first_name', value: createPersonalDto.first_name },
      { field: 'first_last_name', value: createPersonalDto.first_last_name },
      { field: 'second_last_name', value: createPersonalDto.second_last_name },
      { field: 'email', value: createPersonalDto.email },
      { field: 'password', value: createPersonalDto.password },
      { field: 'ci', value: createPersonalDto.ci },
    ];

    for (const { field, value } of fields) {
      if (!value || value.trim() === '') {
        throw new BadRequestException(`${field} cannot be empty`);
      }
    }
  }
  private async checkRoleExists(roleId: number) {
    const roleExists = await this.prismaService.roles.findUnique({
      where: { id: roleId, isActive: true },
    });

    if (!roleExists) {
      throw new NotFoundException(`Role with id -> ${roleId} not found`);
    }
  }
  private async checkIfEmailExists(email: string) {
    const emailExists = await this.prismaService.personal.findUnique({
      where: { email },
    });

    if (emailExists) {
      throw new ConflictException(
        `Personal with email -> ${email} already exists`,
      );
    }
  }
  private async checkIfCIExists(ci: string) {
    const ciExists = await this.prismaService.personal.findUnique({
      where: { ci },
    });

    if (ciExists) {
      throw new ConflictException(`Personal with CI -> ${ci} already exists`);
    }
  }
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
  private handlePrismaError(error: any, email: string) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new ConflictException(
        `Personal with email -> ${email} already exists`,
      );
    }
    throw error;
  }

  async create(createPersonalDto: CreatePersonalDto) {
    this.validateCreatePersonalDto(createPersonalDto);

    await this.checkRoleExists(createPersonalDto.roleId);
    await this.checkIfEmailExists(createPersonalDto.email);
    await this.checkIfCIExists(createPersonalDto.ci);

    try {
      createPersonalDto.password = await this.hashPassword(
        createPersonalDto.password,
      );
      await this.prismaService.personal.create({ data: createPersonalDto });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Personal created successfully',
      };
    } catch (error) {
      this.handlePrismaError(error, createPersonalDto.email);
    }
  }

  findAll() {
    return this.prismaService.personal.findMany();
  }
  async findOne(id: number) {
    const personalFound = await this.prismaService.personal.findUnique({
      where: { id: id },
    });
    if (!personalFound) {
      throw new NotFoundException(`Personal with id -> ${id}, not found`);
    }
    return personalFound;
  }
  async findByEmail(email: string) {
    const personal = await this.prismaService.personal.findUnique({
      where: { email },
    });

    if (!personal) {
      throw new NotFoundException(`Personal with email -> ${email}, not found`);
    }

    return personal;
  }
  // Método para buscar por CI
  async findByCI(ci: string) {
    const personal = await this.prismaService.personal.findUnique({
      where: { ci },
    });

    if (!personal) {
      throw new NotFoundException(`Personal with CI -> ${ci}, not found`);
    }

    return personal;
  }
  // En personal.service.ts
  async findRoleWithPermissions(userId: number) {
    const personal = await this.prismaService.personal.findUnique({
      where: { id: Number(userId) },
      include: {
        role: {
          include: {
            rolesPermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });
    if (!personal) {
      throw new NotFoundException(`Personal with Id -> ${userId}, not found`);
    }
    return personal;
  }

  async activePersonal() {
    const activePersonal = await this.prismaService.personal.findMany({
      where: { isActive: true },
    });

    if (activePersonal.length === 0) {
      throw new NotFoundException('No active personal found');
    }

    return activePersonal;
  }

  async inactivePersonal() {
    const inactivePersonal = await this.prismaService.personal.findMany({
      where: { isActive: false },
    });

    if (inactivePersonal.length === 0) {
      throw new NotFoundException('No inactive personal found');
    }

    return inactivePersonal;
  }

  async update(id: number, updatePersonalDto: UpdatePersonalDto) {
    const personalFound = await this.prismaService.personal.findUnique({
      where: { id },
    });

    if (!personalFound) {
      throw new NotFoundException(`Personal with id -> ${id}, not found`);
    }
    // Si hay una nueva contraseña
    if (updatePersonalDto.password) {
      // Compara la nueva contraseña con la actual
      const isPasswordSame = await bcrypt.compare(
        updatePersonalDto.password,
        personalFound.password,
      );

      if (isPasswordSame) {
        // Si la contraseña es la misma, puedes omitir la actualización de la contraseña
        delete updatePersonalDto.password; // Elimina la propiedad password para no actualizarla
      } else {
        // Si es diferente, hashea la nueva contraseña
        updatePersonalDto.password = await this.hashPassword(
          updatePersonalDto.password,
        );
      }
    }
    try {
      await this.prismaService.personal.update({
        where: { id },
        data: updatePersonalDto,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Personal updated successfully',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Personal with id -> ${id}, not found`);
      }
      throw error;
    }
  }

  async updateIsActive(id: number) {
    const personalFound = await this.prismaService.personal.findUnique({
      where: { id },
    });

    if (!personalFound) {
      throw new NotFoundException(`Personal with id "${id}" not found`);
    }

    const newState = !personalFound.isActive;

    await this.prismaService.personal.update({
      where: { id },
      data: { isActive: newState },
    });

    const message = newState
      ? `Personal has been activated successfully`
      : `Personal has been deactivated successfully`;

    return {
      statusCode: HttpStatus.OK,
      message,
    };
  }

  async remove(id: number) {
    const personalFound = await this.prismaService.personal.findUnique({
      where: { id },
    });

    if (!personalFound) {
      throw new NotFoundException(`Personal with id "${id}" not found`);
    }

    if (personalFound.isActive) {
      throw new ConflictException('Personal cannot be deleted while active');
    }

    await this.prismaService.personal.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `Personal with id "${id}" deleted successfully`,
    };
  }
  async getLoginInfo(email: string) {
    const personal = await this.prismaService.personal.findUnique({
      where: { email },
    });

    if (!personal) {
      throw new NotFoundException(`Personal with email -> ${email}, not found`);
    }
    return {
      email: personal.email,
      password: personal.password,
    };
  }
}
