import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetUserArgs } from './dto/args/get-user.args';
import { CreateUserInput } from './dto/input/create-user.input';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { UpdateUserUnput } from './dto/input/update-user.input';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { nullable: true, name: 'users' })
  async getUsers() {
    return await this.usersService.findAll();
  }

  @Query(() => User, { nullable: true, name: 'user' })
  async getUser(@Args() getUserArgs: GetUserArgs) {
    return await this.usersService.findOne(getUserArgs);
  }

  @Mutation(() => User, { nullable: true, name: 'createUser' })
  async createUser(@Args('createUserData') createUserData: CreateUserInput) {
    return await this.usersService.create(createUserData);
  }

  @Mutation(() => User, { name: 'updateUser', nullable: true })
  async updateUser(@Args('updateUserData') updateUserData: UpdateUserUnput) {
    return await this.usersService.update(updateUserData);
  }

  @Mutation(() => User, { name: 'deleteUser', nullable: true })
  async deleteUser(@Args('deleteUserData') deleteUserData: DeleteUserInput) {
    return await this.usersService.delete(deleteUserData);
  }
}
