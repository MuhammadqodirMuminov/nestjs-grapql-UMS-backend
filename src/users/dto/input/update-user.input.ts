import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserUnput {
  @Field()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsOptional()
  @IsString()
  email: string;

  @Field()
  @IsOptional()
  @IsString()
  password: string;
}
