// src/app.ts
import express, {json, urlencoded} from "express";
import { RegisterRoutes } from "../build/routes";
import * as swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../build/swagger.json";
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import listFiles from 'isomorphic-git';
import http from 'isomorphic-git/http/node';

export const app = express();

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
RegisterRoutes(app);


app.get('/:platform/:username/:repositoryName', async (req, res) => {
  const { platform, username, repositoryName } = req.params;

  let repositoryUrl: string;
  let auth: { username: string; password: string } = { username: '', password: '' };

  if (platform === 'github') {
    repositoryUrl = `https://github.com/${username}/${repositoryName}.git`;
    auth = {
      username: 'HammadAhmad221',
      password: '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',
    };
  } else if (platform === 'bitbucket') {
    repositoryUrl = `https://bitbucket.org/${username}/${repositoryName}.git`;
    auth = {
      username: 'HammadAhmad221',
      password: 'ATBBaz9RJ2LKXGFphTTufSUk3DbV73545F35',
    };
  } else {
    return res.status(400).send('Invalid platform');
  }

  try {
    const repoDir = path.join(__dirname, repositoryName);
    await promisify(fs.mkdir)(repoDir);

    const files = await listFiles.clone({
      dir: repoDir,
      url: repositoryUrl,
      http,
      fs,
      onAuth: () => auth,
    });

    res.send(files);
  } catch (error)
  {
    console.error(error);
    res.status(500).send(error);
  }
  return;
});








