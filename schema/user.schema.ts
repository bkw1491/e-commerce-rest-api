import { number, object, string, transformer } from 'zod';
import { UserModel } from '@models/user.model';
import { compare } from '@utils/crypt';

export interface IUser {
  id: number,
  email: string,
  password: string
}

const user = object({
  id: 
    number().
    max(255),
  email:
    string().
    email().
    max(255),
  password:
    string().
    min(8).
    max(255)
})


export const UserSchema = {

  register: user.omit({id: true}).
    refine(async input => !await UserModel.findOne(input.email),
    {message: "email already in use"}),

  auth: user.omit({id: true}).
    refine(async input => {
      //look for user with supplied email
      const user = await UserModel.findOne(input.email);
      //user with email not found, schema rejects
      if(user) {
        //!need to attach user id to req body, 
        //!not happy with this solution
        (input as any).id = user.id;
        //returns false if passwords don't match
        return compare(input.password, user.password);
      }
      //user doesn't exist, schema rejects
      return false
    }, {message: "invalid email or password"})
}

