import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { GetUserArgs } from './dto/args/get-user.args';
import { CreateUserInput } from './dto/input/create-user.input';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { UpdateUserUnput } from './dto/input/update-user.input';
import { UserDocument } from './models/user.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserData: CreateUserInput): Promise<any> {
    await this.validateUserData(createUserData);
    const createdUser = await this.usersRepository.create({
      ...createUserData,
      image: createUserData.image,
      password: await bcrypt.hash(createUserData.password, 10),
    });

    return this.toModel(createdUser);
  }

  async update(updateUserData: UpdateUserUnput) {
    await this.validateUserData(updateUserData);
    await this.usersRepository.findOneAndUpdate(
      { _id: updateUserData.userId },
      updateUserData,
    );

    const updatedUser = await this.usersRepository.findOne({
      _id: updateUserData.userId,
    });

    return this.toModel(updatedUser);
  }

  async findOne(getUserArgs: GetUserArgs) {
    const userDocument = await this.usersRepository.findOne(getUserArgs);
    return this.toModel(userDocument);
  }

  async findAll() {
    return await this.usersRepository.find({});
  }

  async delete(deleteUserData: DeleteUserInput) {
    const deleteUser = await this.usersRepository.findOneAndDelete({
      _id: deleteUserData.userId,
    });

    return deleteUser;
  }

  private async validateUserData(createUserData: CreateUserInput) {
    let user: UserDocument;
    try {
      user = await this.usersRepository.findOne({
        email: createUserData.email,
      });
    } catch (error) {}

    if (user) {
      throw new UnprocessableEntityException('Email already exists!');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return this.toModel(user);
  }

  private toModel(userDocument: UserDocument) {
    return {
      _id: userDocument._id.toHexString(),
      email: userDocument.email,
      image: userDocument.image,
    };
  }
}
