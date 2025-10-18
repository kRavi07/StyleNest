/* eslint-disable no-unused-vars */
import mongoose, { Types } from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/drimcot";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Ensure global cache exists
global.mongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

export async function connectToDatabase(): Promise<typeof mongoose> {
  try {
    if (global.mongooseCache.conn) {
      return global.mongooseCache.conn;
    }

    if (!global.mongooseCache.promise) {
      const opts = {
        bufferCommands: false,
      };

      global.mongooseCache.promise = mongoose.connect(MONGODB_URI, opts);
    }

    global.mongooseCache.conn = await global.mongooseCache.promise;
    return global.mongooseCache.conn;
  } catch (error) {
    global.mongooseCache.promise = null;
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export default connectToDatabase;

export function toObjectId(id: string): Types.ObjectId {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  return new Types.ObjectId(id);
}
