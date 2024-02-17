import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepositoy } from 'src/database/abstract.repository';
import { User } from './models/user.model';
import { UserDocument } from './models/user.schema';

@Injectable()
export class UsersRepository extends AbstractRepositoy<UserDocument> {
  protected readonly logger = new Logger();
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }
}
