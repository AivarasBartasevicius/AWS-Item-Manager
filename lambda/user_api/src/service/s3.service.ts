import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

export class S3Service {
  private s3Client: S3Client;

  constructor(private bucketName: string, region: string = "eu-north-1") {
    this.s3Client = new S3Client({ region });
  }

  async uploadTxtFile(file: Buffer, fileName: string): Promise<void> {
    const objectKey = fileName;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
      Body: file,
      ContentType: "text/plain",
    });

    await this.s3Client.send(command);
  }

  async deleteFile(fileName: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });

    await this.s3Client.send(command);
  }
}
