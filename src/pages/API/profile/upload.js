import formidable from "formidable";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import clientPromise from "../../../utils/dbConnect";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // Disable default body parser
  },
};

const s3 = new S3Client({ region: process.env.AWS_REGION });

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const sessionToken = req.cookies["next-auth.session-token"];
    const session = await db.collection("sessions").findOne({ sessionToken });

    if (!session || new Date() > new Date(session.expires)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const form = formidable({
      multiples: false, // Allow single file upload
      maxFileSize: MAX_FILE_SIZE,
      filter: ({ mimetype }) => ALLOWED_FILE_TYPES.includes(mimetype),
    });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parse error:", err);
        return res.status(400).json({ message: "Invalid file upload." });
      }
      const file = files.resume[0];
      if (!file) {
        return res.status(400).json({ message: "No file provided." });
      }
      if (!file.filepath) {
        console.error("File path is undefined.");
        return res.status(400).json({ message: "Invalid file path." });
      }
      const fileStream = fs.createReadStream(file.filepath);
      const fileName = `resumes/${Date.now()}-${file.originalFilename}`;
      const fileMetadata = {
        fileName: file.originalFilename,
        uploadedAt: new Date(),
        size: file.size,
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
      };
      try {
        const userid = Object(session.userId);
        const existingUser = await db.collection("users").findOne({ _id: userid });

        console.log("Existing User:", existingUser);

        /* if (existingUser?.resume?.metadata?.url) {
          const oldFileKey = existingUser.resume.metadata.url.split("/").pop();
          if (oldFileKey) {
            console.log("Deleting old file with key:", oldFileKey);

            await s3.send(
              new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: oldFileKey,
              })
            );
          } else  {
            console.error("Invalid old file key.");
          }
        } else {*/
          console.log("No previous file found to delete.");
          await s3.send(
            new PutObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: fileName,
              Body: fileStream,
              ContentType: file.mimetype,
            })
            );
        // }
        await db.collection("users").updateOne(
          { _id: userid },
          {
            $set: { "resume.metadata": fileMetadata },
            $push: {
              "resume.history": {
                $each: [fileMetadata],
                $slice: -5,
              },
            },
          }
        );

        return res.status(200).json({ message: "Resume uploaded successfully", metadata: fileMetadata });
      } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ message: "File upload failed" });
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
