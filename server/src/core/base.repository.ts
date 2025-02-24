import { Document, Model } from "mongoose";

/**
 * Generic Repository for MongoDB CRUD operations using Mongoose
 */
export class BaseRepository<T extends Document> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /** Create a new document */
  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return await document.save();
  }

  /** Find all documents */
  async findAll(filter: object = {}): Promise<T[]> {
    return await this.model.find(filter).exec();
  }

  /** Find one document by ID */
  async findById(id: string): Promise<T | null> {
    return await this.model.findOne({ _id: id }).exec();
  }
  /** Find one document by column/field name */
  async findOneByField<K extends keyof T>(
    field: K,
    value: unknown
  ): Promise<T | null> {
    return await this.model
      .findOne({ [field]: value } as Record<string, unknown>)
      .exec();
  }

  /** Find one document by field name and allow selecting specific fields */
  async findOneByFieldWithSelect<K extends keyof T>(
    field: K,
    value: unknown,
    selectedFields: string[] // Fields to include explicitly
  ): Promise<T | null> {
    return await this.model
      .findOne({ [field]: value } as Record<string, unknown>)
      .select(selectedFields.join(" ")) // Dynamically select required fields
      .exec();
  }

  /** Update a document by ID */
  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model
      .findOneAndUpdate({ _id: id }, data, { new: true })
      .exec();
  }

  /** Delete a document by ID */
  /** Delete a document by ID */
  async delete(id: string): Promise<T | null> {
    return await this.model.findOneAndDelete({ _id: id }).exec();
  }
}
