import express from 'express';
import cors from 'cors';
import { SERVER_PORT, SERVER_URL } from './configs.js';

const api = express();

api.use(express.json());
api.use(cors({ origin: '*' }));


api.listen(SERVER_PORT, () => {
  console.log(SERVER_URL);
});
