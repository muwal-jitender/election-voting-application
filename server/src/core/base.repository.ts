import mongoose, { Document, Model, UpdateQuery } from "mongoose";

/**
 * Generic Repository for MongoDB CRUD operations using Mongoose
 */
export class BaseRepository<T extends Document> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /** Create a new document */
  async create(data: Partial<T>, session?: mongoose.ClientSession): Promise<T> {
    const document = new this.model(data, session);
    return await document.save();
  }

  /** Find all documents */
  async findAll(filter: object = {}): Promise<T[]> {
    return await this.model.find(filter).exec();
  }

  /** Find one document by ID */
  async findById1(
    id: string,
    populateFields: string[] = [],
    session?: mongoose.ClientSession
  ): Promise<T | null> {
    let query = this.model.findOne({ _id: id }, { session });
    if (populateFields.length > 0) {
      query = query.populate(populateFields.join(" "));
    }
    return await query.exec();
  }

  /** Find one document by ID */
  async findById(
    id: string,
    populateFields: string[] = [],
    session?: mongoose.ClientSession
  ): Promise<T | null> {
    let query = this.model.findOne({ _id: id }).session(session ?? null); // ✅ Correct way to pass session

    if (populateFields.length > 0) {
      query = query.populate(populateFields.join(" "));
    }

    return await query.exec();
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
  async update(
    id: string,
    updateData: UpdateQuery<T>,
    session?: mongoose.ClientSession
  ): Promise<T | null> {
    return await this.model
      .findOneAndUpdate({ _id: id }, updateData, {
        new: true,
        useFindAndModify: false,
        session,
      })
      .exec();
  }
  /** Delete a document by ID */
  async delete(
    id: string,
    session?: mongoose.ClientSession
  ): Promise<T | null> {
    return await this.model.findOneAndDelete({ _id: id }, { session }).exec();
  }
  /** Delete a document by ID */
  async deleteMany(filter: object = {}): Promise<void> {
    await this.model.deleteMany(filter).exec();
  }
}
