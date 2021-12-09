import { object, string } from 'zod';
import { findOne } from '@controllers/user.controller';
import { compare } from '@utils/crypt';

export interface IUser {
  id: number,
  email: string,
  pass: string
}

export const registerSchema = object({

  email: string().email().max(255),
  pass: string().min(8).max(255)

}).refine(async input => {
  //check email is not in use
  return await !findOne(input.email)
  //custom error message for conflict
}, {message: "Email Already In Use"});

export const authSchema = object({

  email: string().email().max(255),
  pass: string().min(8).max(255)

}).refine(async candidate => {
  //check if the user exists
  const user = await findOne(candidate.email);
  //user with email not found, schema rejects
  if(!user) { return false }
  //returns falsey if passwords don't match, schema rejects
  return compare(candidate.pass, user.pass);
  //custom error message for auth rejection
}, {message: "Invalid Email Or Password"});

