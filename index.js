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
import httpServer from 'http';
import { Server as useSocket } from 'socket.io';
import { createChats } from './controllers/chat/createChat.js';
// import { addMessage } from './controllers/chat/addMessage.js';
import { getMessages } from './controllers/chat/getMessages.js';
import { getChats } from './controllers/chat/getChats.js';
import { addMessage } from './sockets/utils/addMessage.js';

const api = express();
const server = httpServer.Server(api);

const io = new useSocket(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

api.use(express.json());
api.use(cors({ origin: '*' }));
api.use('/uploads', express.static('uploads'));

dotenv.config();

mongoose
  .connect(process.env.DB_HOST)
  .then(() => console.log('mongodb success'))
  .catch((err) => console.log('mongodb error', err));

io.on('connection', function (socket) {
  socket.on('CHAT:JOIN', ({ chatId }) => {
    socket.join(chatId);

    // socket.to(chatId).emit('ROOM:SET_USERS', { chatId });
  });

  socket.on('CHAT:ADD_MESSAGE', ({ sendId, message, chatId }) => {
    addMessage({ sendId, message, chatId, userId: sendId });
    socket.to(chatId).emit('CHAT:ADD_MESSAGE', { message, sendId });
  });

  socket.on('CHAT:CREATE', ({ chatId, name, avatarUrl }) => {
    const obj = {
      chatId,
      name,
      avatarUrl,
    };
    socket.to(chatId).emit('CHAT:CREATE', obj);
  });

  console.log('connected!');
});

api.post('/auth/register', registerValidation, handleValidationErrors, register);
api.post('/auth/login', loginValidation, handleValidationErrors, login);
api.get('/auth/me', checkAuth, getMe);

api.get('/users', checkAuth, getUsers);
api.get('/user/:id', getUser);

api.post('/add-friend', checkAuth, addFriend);

api.post('/create-chat', checkAuth, createChats);

api.post('/add-message', checkAuth, addMessage);

api.get('/chat-user/:id', getMessages);
api.get('/chats', checkAuth, getChats);

server.listen(SERVER_PORT, () => {
  console.log(SERVER_URL);
});
