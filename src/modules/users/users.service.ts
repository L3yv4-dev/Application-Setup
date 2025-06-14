
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async createOrUpdate(userData: Partial<User>): Promise<User> {
     if (!userData.username) {
    throw new BadRequestException('El nombre de usuario es indefinido o nulo');
  }
    let user = await this.findByUsername(userData.username);
    if (!user) {
      user = this.usersRepository.create(userData);
    } else {
      Object.assign(user, userData);
    }
    return this.usersRepository.save(user);
  }
}
