import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { Db } from '@api/prisma';
import {
  CreateUserDto,
  PrivateUser,
  UpdateUserInputDto,
  UserView,
} from '@repo/types';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly logger: PinoLogger,
  ) {}

  async create(createUserDto: CreateUserDto, db?: Db): Promise<UserView> {
    const existing = await this.usersRepository.findByEmail(
      createUserDto.email,
      db,
    );
    if (existing) {
      this.logger.warn(
        { email: createUserDto.email },
        'User creation rejected because email is already in use',
      );
      throw new ConflictException('User already exists');
    }

    const user = await this.usersRepository.create(createUserDto, db);
    this.logger.info({ userId: user.id }, 'User created successfully');

    return user;
  }

  async update(
    id: string,
    data: UpdateUserInputDto,
    db?: Db,
  ): Promise<UserView> {
    const user = await this.usersRepository.update(id, data, db);
    this.logger.info({ userId: id }, 'User updated successfully');
    return user;
  }

  async findById(id: string, db?: Db): Promise<UserView | null> {
    return this.usersRepository.findById(id, db);
  }

  async findByEmail(email: string, db?: Db): Promise<UserView | null> {
    return this.usersRepository.findByEmail(email, db);
  }

  async requireById(id: string, db?: Db): Promise<UserView> {
    const user = await this.usersRepository.findById(id, db);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findPrivateUserById(id: string, db?: Db): Promise<PrivateUser | null> {
    return this.usersRepository.findPrivateUserById(id, db);
  }

  async findPrivateUserByEmail(
    email: string,
    db?: Db,
  ): Promise<PrivateUser | null> {
    return this.usersRepository.findPrivateUserByEmail(email, db);
  }

  async getUsersForOrg(
    orgId: string,
    search?: string,
    db?: Db,
  ): Promise<UserView[]> {
    if (search?.trim()) {
      return this.usersRepository.searchUsersByOrgId(orgId, search.trim(), db);
    }
    return this.usersRepository.getUsersByOrgId(orgId, db);
  }

  async searchUsers(search: string, db?: Db): Promise<UserView[]> {
    return this.usersRepository.searchUsers(search, db);
  }

  async getAllUsers(db?: Db): Promise<UserView[]> {
    return this.usersRepository.getAllUsers(db);
  }

  async findUserOrganizationIds(
    userId: string,
    db?: Db,
  ): Promise<{
    id: string;
    activeOrganizationId: string;
    defaultOrganizationId: string | null;
  } | null> {
    return this.usersRepository.findUserOrganizationIds(userId, db);
  }

  async getUsersWithActiveOrganization(
    organizationId: string,
    db?: Db,
  ): Promise<Array<{ id: string; defaultOrganizationId: string | null }>> {
    return this.usersRepository.getUsersWithActiveOrganization(
      organizationId,
      db,
    );
  }

  async updateOrganization(
    userId: string,
    organizationId: string,
    db?: Db,
  ): Promise<void> {
    return this.usersRepository.updateOrganization(userId, organizationId, db);
  }

  async updateUserOrganizationIds(
    userId: string,
    data: { activeOrganizationId: string; defaultOrganizationId?: string },
    db?: Db,
  ): Promise<void> {
    return this.usersRepository.updateUserOrganizationIds(userId, data, db);
  }

  async updateUsersOrganizationIds(
    updates: Array<{
      userId: string;
      activeOrganizationId: string;
      defaultOrganizationId?: string;
    }>,
    db?: Db,
  ): Promise<void> {
    return this.usersRepository.updateUsersOrganizationIds(updates, db);
  }
}
