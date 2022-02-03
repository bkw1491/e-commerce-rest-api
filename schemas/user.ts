import { number, object, string } from 'zod';
import { UserModel } from '@models/User';
import { compare } from '@utils/crypt';


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
    max(255),
  confirm:
    string().
    max(255)
})


export const UserSchema = {

  register: user.omit({id: true}).
    refine(async input => { return !await UserModel.findOneByEmail(input.email) },
    {message: "email in use"}).
    refine(input => { return input.password === input.confirm },
    {message: "passwords do not match"}),

  auth: user.omit({id: true, confirm: true}).
    refine(async input => {
      //look for user with supplied email
      const user = await UserModel.findOneByEmail(input.email);
      //user doesn't exist, schema rejects
      if(!user) { return false }
      //!need to attach id and admin to req body, 
      //!not happy with this solution
      (input as any).id = user.id;
      (input as any).admin = user.admin
      //returns false if passwords don't match
      return compare(input.password, user.password);
      
    }, {message: "invalid email or password"})
}

