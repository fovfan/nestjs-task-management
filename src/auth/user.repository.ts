import { ConflictException, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import { stat } from "fs";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp (authCredentialsDto: AuthCredentialsDto): Promise<void>{
    const { password, username} = authCredentialsDto;

    const user = new User();
    user.salt = await bcrypt.genSalt();
    user.username = username;
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
    } catch (error) {
      if(error.code === '23505'){
        throw new ConflictException('Username already exists')
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { password, username} = authCredentialsDto;
    const user = await this.findOne({ username })
    if( user && await user.validatePassword(password)) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
      return bcrypt.hash(password, salt);
  }
}