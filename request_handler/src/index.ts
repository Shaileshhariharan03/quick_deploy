require("dotenv").config();
import express from "express";
import { S3 } from "aws-sdk";

const s3 = new S3({
  endpoint: process.env.ENDPOINT,
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
});

const app = express();

app.get("/{*splat}", async (req, res) => {
  try {
    const host = req.hostname;
    const id = host.split(".")[0];

    // Default to /index.html if path is /
    const filePath = req.path === "/" ? "/index.html" : req.path;

    const s3Key = `dist/${id}${filePath}`;
    console.log(`Fetching from S3: ${s3Key}`);

    const contents = await s3
      .getObject({
        Bucket: "vercel",
        Key: s3Key,
      })
      .promise();

    const type = filePath.endsWith("html")
      ? "text/html"
      : filePath.endsWith("css")
      ? "text/css"
      : filePath.endsWith("svg")
      ? "image/svg+xml"
      : filePath.endsWith("jpg") || filePath.endsWith("jpeg")
      ? "image/jpeg"
      : filePath.endsWith("png")
      ? "image/png"
      : "application/javascript";

    res.set("Content-Type", type);
    res.send(contents.Body);
  } catch (err) {
    console.error("Error loading file:", err);
    res.status(404).send("File not found");
  }
});

app.listen(80);
