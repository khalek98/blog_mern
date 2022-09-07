import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';
import mongoose from 'mongoose';

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
  editUserValidation,
} from './validations/validations.js';
import { checkAuth, handleValidatonErrors } from './utils/index.js';

import { PostController, UserController } from './controllers/index.js';

mongoose
  .connect(
    process.env.MONGODB_URI ||
      'mongodb+srv://admin:17supusaH@cluster0.ufyxye3.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) =>
  res.send('<h1>Data Base for MERN Blog App by Khalek</h1>'),
);

app.post('/auth/sign-in', loginValidation, handleValidatonErrors, UserController.login);
app.post('/auth/sign-up', registerValidation, handleValidatonErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getUser);
app.patch('/user/:id', editUserValidation, handleValidatonErrors, UserController.userEdit);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidatonErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidatonErrors,
  PostController.update,
);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK!');
});
