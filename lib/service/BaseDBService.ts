// lib/services/BaseService.ts
import { Model, Document } from "mongoose";

interface PaginateOptions {
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
  select?: string | string[];
  deselect?: string | string[];
  sort?: Record<string, 1 | -1>;
  search?: string;
  searchFields?: string[];
  populate?: string | string[]; // populate fields
  countFields?: string | string[]; // array fields to count even if deselected
}

export class BaseService<T extends Document> {
  model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async paginate(options: PaginateOptions) {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = (page - 1) * limit;

    const filters = options.filters || {};
    const searchFields = options.searchFields || [];

    let matchStage: any = { ...filters };

    // Apply simple search
    if (options.search && searchFields.length) {
      matchStage.$or = searchFields.map((field) => ({
        [field]: { $regex: options.search, $options: "i" },
      }));
    }

    // Build aggregation pipeline
    const pipeline: any[] = [{ $match: matchStage }];

    // Sorting
    if (options.sort) pipeline.push({ $sort: options.sort });

    // Skip & limit
    pipeline.push({ $skip: skip }, { $limit: limit });

    // Compute counts for deselected array fields
    if (options.countFields) {
      const countFields = Array.isArray(options.countFields)
        ? options.countFields
        : options.countFields.split(",").map((f) => f.trim());

      pipeline.push({
        $addFields: countFields.reduce(
          (acc, field) => {
            acc[`${field}Count`] = { $size: `$${field}` };
            return acc;
          },
          {} as Record<string, any>
        ),
      });
    }

    // Projection for select/deselect
    const project: Record<string, any> = {};

    // Apply select
    if (options.select) {
      const selectFields = Array.isArray(options.select)
        ? options.select
        : options.select.split(",").map((f) => f.trim());
      selectFields.forEach((f) => (project[f] = 1));
    }

    // Apply deselect
    if (options.deselect) {
      const deselectFields = Array.isArray(options.deselect)
        ? options.deselect
        : options.deselect.split(",").map((f) => f.trim());
      deselectFields.forEach((f) => (project[f] = 0));
    }

    if (Object.keys(project).length > 0) pipeline.push({ $project: project });

    // Populate (post aggregation using lookup if needed)
    // For now, leave populate to be used on model.find() if aggregation not used

    const data = await this.model.aggregate(pipeline);

    // Count total documents (for pagination)
    const total = await this.model.countDocuments(matchStage);

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string, options?: { select?: string; deselect?: string }) {
    let query = this.model.findById(id);
    if (options?.select) query = query.select(options.select);
    if (options?.deselect) query = query.select(`-${options.deselect}`);
    return query.lean();
  }

  async findOne(
    filter: Record<string, any>,
    options?: { select?: string; deselect?: string }
  ) {
    let query = this.model.findOne(filter);
    if (options?.select) query = query.select(options.select);
    if (options?.deselect) query = query.select(`-${options.deselect}`);
    return query;
  }

  async create(data: Partial<T>) {
    return this.model.create(data);
  }

  async updateById(id: string, data: Partial<T>) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async deleteById(id: string) {
    return this.model.findByIdAndDelete(id).lean();
  }
}
