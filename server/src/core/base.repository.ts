import mongoose, { Document, Model, Types, UpdateQuery } from "mongoose";

type PopulateOption = {
  path: string;
  select?: string[];
};

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

  /** Find one document by field name and allow selecting specific fields */
  async findAll2<K extends keyof T>(
    filter: object = {},
    selectedFields: K[] = [], // Fields to include explicitly
    populateFields: PopulateOption[] = []
  ): Promise<T[] | null> {
    return await this.model
      .find(filter)
      .populate(
        populateFields.map((e) => {
          return {
            path: e.path,
            select: e.select,
          };
        })
      )
      .select(selectedFields.join(" "))
      .exec();
  }

  /** Find all documents with pagination, sorting, and filtering */
  async findAllPaginated({
    filter = {},
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  }: {
    filter?: object;
    page?: number;
    limit?: number;
    sortBy?: string;
    order: "asc" | "desc";
  }): Promise<{ data: T[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    const sortOrder = order === "desc" ? -1 : 1;
    const [data, totalCount] = await Promise.all([
      this.model
        .find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(filter),
    ]);
    return { data, totalCount };
  }

  /** Find one document by ID */
  async findById(
    id: string,
    populateFields: string[] = [],
    session?: mongoose.ClientSession
  ): Promise<T | null> {
    let query = this.model.findOne({ _id: id }).session(session ?? null); // ✅ Pass the session to handle the transaction

    if (populateFields.length > 0) {
      query = query.populate(populateFields.join(" "));
    }

    return await query.exec();
  }

  /** Find one document by ID with optional population and field selection */
  async findDocumentById<K extends keyof T>(
    id: string,
    populateFields: string[] = [],
    session?: mongoose.ClientSession,
    selectedFields: K[] = []
  ): Promise<Partial<T> | T | null> {
    let query = this.model
      .findById(id)
      .session(session ?? null)
      .lean();

    if (selectedFields.length > 0) {
      query = query.select((selectedFields as string[]).join(" "));
    }

    if (populateFields.length > 0) {
      query = query.populate(populateFields.join(" "));
    }

    return (await query.exec()) as T | Partial<T> | null;
  }
  /** Find multiple documents by an array of IDs */
  async findByIds(
    ids: string[],
    populateFields: string[] = [],
    session?: mongoose.ClientSession
  ): Promise<T[]> {
    let query = this.model.find({ _id: { $in: ids } }).session(session ?? null); // ✅ Match documents with IDs

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
    id: Types.ObjectId | string,
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
  async deleteMany(
    filter: object = {},
    session?: mongoose.ClientSession
  ): Promise<void> {
    await this.model.deleteMany(filter, session).exec();
  }

  async updateMany(
    filter: object = {},
    update: object = {},
    session?: mongoose.ClientSession
  ): Promise<void> {
    await this.model.updateMany(filter, update, { session }).exec();
  }
}
