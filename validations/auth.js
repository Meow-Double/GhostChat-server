import { body } from 'express-validator';

export const registerValidation = [
  body('name')
    .isLength({ min: 4, max: 16 })
    .withMessage('Имя должно содержать от 4 до 16 символов'),
  body('email')
    .isEmail()
    .withMessage('Пожалуйста, введите действительный адрес электронной почты')
    .isLength({ min: 6, max: 40 })
    .withMessage('Длина адреса электронной почты должна быть от 6 до 40 символов'),
  body('password')
    .isLength({ min: 6, max: 16 })
    .withMessage('Длина пароля должна быть от 6 до 16 символов'),
];
export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Пожалуйста, введите действительный адрес электронной почты')
    .isLength({ min: 6, max: 40 })
    .withMessage('Длина адреса электронной почты должна быть от 6 до 40 символов'),
  body('password')
    .isLength({ min: 6, max: 16 })
    .withMessage('Длина пароля должна быть от 6 до 16 символов'),
];
