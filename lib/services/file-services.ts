import { FileInfo } from "@/lib/db/models/FileInfo";
import { uploadToS3 } from "./s3-services";
import { hashFile } from "../utils";

export const isFileExist = async (hash: string) => {
  const existingFile = await FileInfo.findOne({ hash });
  if (existingFile) {
    return {
      exists: true,
      file: existingFile,
    };
  } else {
    return {
      exists: false,
      file: null,
    };
  }
};

export const uploadFileAndSaveMetadata = async ({
  buffer,
  originalFilename,
  mimetype,
  key,
  hash,
}: {
  buffer: Buffer;
  originalFilename: string;
  mimetype: string;
  key: string;
  hash: string;
}) => {
  // Upload to S3
  const url = await uploadToS3({ buffer, originalFilename, mimetype, key });

  // Save to DB
  await FileInfo.create({
    hash,
    s3Key: key,
    originalFilename,
    mimetype,
    size: buffer.length,
  });

  return url;
};

export const processFileUpload = async (
  file: File,
  keyPrefix: string
): Promise<string> => {
  const hash = await hashFile(file);
  const existingFile = await isFileExist(hash);

  if (existingFile.exists) {
    return existingFile.file.s3Key;
  }

  const arrayBuffer = await file.arrayBuffer();
  const key = `${keyPrefix}/${hash}`;
  const buffer = Buffer.from(arrayBuffer);

  const url = await uploadFileAndSaveMetadata({
    hash,
    buffer,
    originalFilename: file.name,
    mimetype: file.type,
    key,
  });

  return url;
};
