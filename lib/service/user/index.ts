import User from "@/lib/db/models/user";
import { AppError } from "@/lib/error/AppError";

export const getUsers = ({
  page,
  limit,
  search,
  status,
}: {
  page: number;
  limit: number;
  search: string;
  status: string;
}) => {
  try {
    var filter: Record<string, any> = {};
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    if (status) {
      filter.status = status;
    }
    return User.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new AppError("Failed to get users for these filters", 404);
  }
};
