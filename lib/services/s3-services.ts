// Required for disabling Next.js built-in body parsing

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import path from "path";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface UploadParams {
  buffer: Buffer;
  originalFilename: string;
  mimetype: string;
  key: string;
}

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.AWS_BUCKET_NAME!;

export async function uploadToS3({
  buffer,
  originalFilename,
  mimetype,
  key,
}: UploadParams): Promise<string> {
  const s3Key = `${key}${path.extname(originalFilename)}`;
  console.log("Uploading file to S3:");
  const hash = key.split("/").pop();
  if (!hash) {
    throw new Error("Invalid file key provided for upload to S3.");
  }
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: buffer,
        ContentType: mimetype || "application/octet-stream",
      })
    );

    return s3Key;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
}

async function generatePresignedUrl(s3Key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: s3Key,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour

  return url;
}
