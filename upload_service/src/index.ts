import express, { response } from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import path from "path";
import { getAllFiles } from "./files";
import { uploadFile } from "./aws";
import { createClient } from "redis";

//redis
const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
  const repoURL = req.body.repoURL;
  const id = generate();

  //clone repo
  await simpleGit().clone(repoURL, path.join(__dirname, `output/${id}`));

  //get file directories
  const files = getAllFiles(path.join(__dirname, `output/${id}`));

  //upload file to S3
  await Promise.all(
    files.map((file) => {
      const relativePath = file.slice(__dirname.length + 1);
      return uploadFile(relativePath, file);
    })
  );

  //add to redis queue
  publisher.lPush("build-queue", id);

  publisher.hSet("status", id, "uploaded");

  res.json({
    id: id,
    response: files,
  });
});

app.get("/status", async (req, res) => {
  const id = req.query.id;
  const response = await subscriber.hGet("status", id as string);
  res.json({
    status: response,
  });
});

app.listen(3000);
