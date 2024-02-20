import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthCrendentialsDto } from '../dtos/auth-crendentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCrenditalsDto: AuthCrendentialsDto): Promise<void> {
    const { username, password } = authCrenditalsDto;
    const salt = await bcrypt.genSalt();
    const hashpassword = await bcrypt.hash(password, salt);
    const user = this.create({ username, password: hashpassword });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User name already exist.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
