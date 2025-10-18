export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
  filters?: Record<string, any>;
}

import { z } from "zod";
import { ValidationError } from "../error/AppError";
const paginationSchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  search: z.string().optional(),
  sort: z.string().optional(),
});

export function getPaginationParams(url: URL): PaginationParams {
  const raw = Object.fromEntries(url.searchParams.entries());
  const parsed = paginationSchema.safeParse(raw);

  if (!parsed.success) {
    throw new ValidationError(parsed.error.format());
  }

  const { page, limit, search, sort, ...rest } = parsed.data;
  return {
    page: Math.max(1, parseInt(page, 10)),
    limit: Math.max(1, Math.min(100, parseInt(limit, 10))),
    search,
    sort,
    filters: rest,
  };
}

export async function paginate(
  model: any,
  params: PaginationParams,
  baseFilter: any = {}
) {
  const { page, limit, sort, filters } = params;

  const query = { ...baseFilter, ...filters };

  const [data, total] = await Promise.all([
    model
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort ? { [sort]: 1 } : {})
      .lean(),
    model.countDocuments(query),
  ]);

  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
