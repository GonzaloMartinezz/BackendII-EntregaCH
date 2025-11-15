import { hashSync , genSaltSync , compareSync } from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
export const hashPassword = (password) => hashSync(password, genSaltSync(10));
export  const isValidPassword = (password , hash) => compareSync(password, hash);
export const createToken = (user , expires) => jwt.sign({user}, JWT_SECRET , {expiresIn : expires});
export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);
 