import mongoose, { Document, Model, Types, UpdateQuery } from "mongoose";

import { AppError } from "utils/exceptions.utils";
import { StatusCodes } from "http-status-codes";

type PopulateMap = {
  [k in string]: readonly (keyof any)[];
};

type PopulateOptionStrict<M extends PopulateMap> = {
  [K in keyof M]: {
    path: K extends string ? K : never;
    select?: M[K];
  };
}[keyof M][];

/**
 * Generic Repository for MongoDB CRUD operations using Mongoose
 */
export class BaseRepository<T extends Document, P extends PopulateMap = {}> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /** Create a new document */
  async create(data: Partial<T>, session?: mongoose.ClientSession): Promise<T> {
    const document = new this.model(data, session);
    return await document.save();
  }

  /**
   * Retrieves all documents that match the specified filter and returns them with only the selected fields.
   *
   * @template K - A key of the generic type T representing the document's top-level fields.
   * @template P - A map of fields that can be populated, each with a list of valid subfields to select.
   *
   * @param {object} [filter={}] - The MongoDB query filter used to match documents.
   * @param {K[]} [selectedFields=[]] - An array of field names from the document to include in the result.
   * @param {PopulateOptionStrict<P>} [populateFields=[]] - A strictly typed array of population options specifying which related documents to populate and which fields to include.
   *
   * @returns {Promise<T[]>} A promise that resolves to an array of documents matching the filter,
   *                         optionally selecting specific fields and populating specified references.
   *
   * @example
   * // Example: Retrieve elections with only 'title' and 'thumbnail', and populate related 'candidates'
   * await electionRepository.findAll(
   *   {},
   *   ['title', 'thumbnail'],
   *   [
   *     { path: 'candidates', select: ['fullName', 'image'] },
   *     { path: 'voters', select: ['email'] }
   *   ]
   * );
   */

  async findAll<K extends keyof T>(
    filter: object = {},
    selectedFields: K[] = [],
    populateFields: PopulateOptionStrict<P> = [] // ✅ Strictly typed
  ): Promise<T[]> {
    return await this.model
      .find(filter)
      .populate(
        populateFields.map((e) => ({
          path: e.path,
          select: e.select?.join(" "),
        })) as mongoose.PopulateOptions[] // ✅
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
    id: Types.ObjectId,
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
  async findOneByFieldWithSelect(
    filter: object = {},
    selectedFields: string[] // Fields to include explicitly
  ): Promise<T | null> {
    return await this.model
      .findOne(filter)
      .select(selectedFields.join(" ")) // Dynamically select required fields
      .exec();
  }
  /**
   * Finds multiple documents that match multiple field-value conditions.
   *
   * @template K - Keys of the document type T (field names)
   * @param fields - Array of field names to filter by
   * @param values - Array of values corresponding to each field
   * @param selectedFields - (Optional) Array of field names to include in the result.
   *                         If not provided, all fields will be returned.
   * @returns Promise that resolves to an array of matching documents
   * @example
   * Fetch users with role "admin" and isActive = true, return only _id and email
   * findManyByFields(["role", "isActive"], ["admin", true], ["_id", "email"]);
   *
   * @example
   *  Fetch all fields for matching user
   * findManyByFields(["email"], ["user@example.com"]);
   */
  async findManyByFields<K extends keyof T>(
    fields: K[],
    values: unknown[],
    selectedFields?: string[] // Fields to include explicitly
  ): Promise<T[]> {
    if (fields.length !== values.length) {
      throw new AppError(
        "Fields and values arrays must have the same length.",
        StatusCodes.BAD_REQUEST
      );
    }

    const query = fields.reduce(
      (acc, field, index) => {
        acc[field as string] = values[index];
        return acc;
      },
      {} as Record<string, unknown>
    );

    const mongoQuery = this.model.find(query);
    if (selectedFields && selectedFields.length > 0) {
      mongoQuery.select(selectedFields.join(" ")); // Dynamically select required fields
    }
    return await mongoQuery.exec();
  }

  /**
   * Finds single document that matches multiple field-value conditions.
   *
   * @template K - Keys of the document type T (field names)
   * @param fields - Array of field names to filter by
   * @param values - Array of values corresponding to each field
   * @param selectedFields - (Optional) Array of field names to include in the result.
   *                         If not provided, all fields will be returned.
   * @returns Promise that resolves to an array of matching documents
   * @example
   * Fetch users with role "admin" and isActive = true, return only _id and email
   * findOneByMultipleSelect(["role", "isActive"], ["admin", true], ["_id", "email"]);
   *
   * @example
   *  Fetch all fields for matching user
   * findOneByMultipleSelect(["email"], ["user@example.com"]);
   */
  async findOneByMultipleSelect<K extends keyof T>(
    fields: K[],
    values: unknown[],
    selectedFields?: string[] // Fields to include explicitly
  ): Promise<T | null> {
    if (fields.length !== values.length) {
      throw new AppError(
        "Fields and values arrays must have the same length.",
        StatusCodes.BAD_REQUEST
      );
    }

    const mongoQuery = this.model.findOne({ fields: values } as Record<
      string,
      unknown
    >);
    if (selectedFields && selectedFields.length > 0) {
      mongoQuery.select(selectedFields.join(" ")); // Dynamically select required fields
    }
    return await mongoQuery.exec();
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
    id: Types.ObjectId,
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
