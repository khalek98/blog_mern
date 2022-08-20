import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Wrong form email').isEmail(),
  body('password', 'Password length must be at least 8 characters long').isLength({ min: 8 }),
];

export const registerValidation = [
  body('email', 'Wrong form email').isEmail(),
  body('password', 'Password length must be at least 8 characters long').isLength({ min: 8 }),
  body('fullName', 'Name must be at least 3 characters long').isLength({ min: 3 }),
  body('avatarUrl', 'Wrong avatar link').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'Entered heder must be at least 3 characters long').isLength({ min: 3 }).isString(),
  body('text', 'Entered text must be at least 10 characters long').isLength({ min: 10 }).isString(),
  body('tags', 'Wrong form tags (specify an array)').optional().isString(),
  body('imageUrl', 'Wrong image link').optional().isString(),
];
