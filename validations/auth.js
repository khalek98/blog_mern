import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Wrong form email').isEmail(),
  body('password', 'Password length must be at least 8 characters long').isLength({ min: 8 }),
  body('fullName', 'Name must be at least 3 characters long').isLength({ min: 3 }),
  body('avatarUrl', 'wrong avatar link').optional().isURL(),
];
