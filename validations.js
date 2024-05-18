import { body } from "express-validator";


export const registerValidation = [
    body('email','de email').isEmail(),
    body('password').isLength({min:5}),
    body('fullName').isLength({min:3}),
    body('avatarUrl').optional().isURL(),
]
export const LoginValidation = [
    body('email','de email').isEmail(),
    body('password','мало').isLength({min:5}),
]
export const postCreateValidation = [
    body('title', 'Введите заголовок ').isLength({ min: 5 }).isString(),
    body('text', 'Введите текст статьї').isLength({ min: 5}).isString(),
    body('tags', 'Неверный формат тэгов (укажите массив)').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]