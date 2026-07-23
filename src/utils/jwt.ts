import { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const createToken = (payload: any, secret: string, options: SignOptions) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: options,
  } as SignOptions);

  return token;
};


export const jwtUtils = {
    createToken
}