import express from 'express';
import cors from 'cors';
import { SERVER_PORT, SERVER_URL } from './configs.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { register } from './controllers/auth/register.js';
import { loginValidation, registerValidation } from './validations/auth.js';
import { handleValidationErrors } from './utils/handleValidationErrors.js';
import { login } from './controllers/auth/login.js';
import { getMe } from './controllers/auth/getMe.js';
import { checkAuth } from './utils/checkAuth.js';
import { getUser } from './controllers/users/getUser.js';
import { getUsers } from './controllers/users/users.js';
import { addFriend } from './controllers/users/addFriend.js';

const api = express();

api.use(express.json());
api.use(cors({ origin: '*' }));
api.use('/uploads', express.static('uploads'));

dotenv.config();

mongoose
  .connect(process.env.DB_HOST)
  .then(() => console.log('mongodb success'))
  .catch((err) => console.log('mongodb error', err));

api.post('/auth/register', registerValidation, handleValidationErrors, register);
api.post('/auth/login', loginValidation, handleValidationErrors, login);
api.get('/auth/me', checkAuth, getMe);

api.get('/users', checkAuth, getUsers);
api.get('/user/:id', getUser);

api.post('/add-friend', checkAuth, addFriend);

api.listen(SERVER_PORT, () => {
  console.log(SERVER_URL);
});
