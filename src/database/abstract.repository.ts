import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, QueryOptions, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepositoy<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  // creata a document for spesific model
  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as TDocument;
  }

  // find one document for a spesicfic document
  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true });

    if (!document) {
      this.logger.warn('document not found for this query', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document as TDocument;
  }

  //find many documents for a specsific model
  async find(filterQuery: FilterQuery<TDocument>) {
    return await this.model.find(filterQuery);
  }

  // findOne and update
  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    updateQuery: UpdateQuery<TDocument>,
    queryOptions: QueryOptions<TDocument> = { lean: true },
  ) {
    const document = await this.model.findOneAndUpdate(
      filterQuery,
      updateQuery,
      queryOptions,
    );

    if (!document) {
      this.logger.warn('Document not found with this query', filterQuery);
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  //find One and delete document
  async findOneAndDelete(filterQuery: FilterQuery<TDocument>) {
    const document = await this.model.findOneAndDelete(filterQuery, {
      lean: true,
    });

    if (!document) {
      this.logger.warn(`Document not found with filterQuery:`, filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async findOneById(
    id: number | string | Types.ObjectId,
    queryOptins: QueryOptions<TDocument>,
  ) {
    const document = await this.model.findById(id, {}, queryOptins);

    if (!document) {
      this.logger.warn(`Document not found with id:`, id);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }
}
