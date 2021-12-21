import { number, object, string } from 'zod';
import { UserModel } from '@models/user.model';
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
})


export const UserSchema = {

  register: user.omit({id: true}).
    refine(async input => !await UserModel.findOneByEmail(input.email),
    {message: "email already in use"}),

  auth: user.omit({id: true}).
    refine(async input => {
      //look for user with supplied email
      const user = await UserModel.findOneByEmail(input.email);
      //user with email not found, schema rejects
      if(user) {
        //!need to attach id and admin to req body, 
        //!not happy with this solution
        (input as any).id = user.id;
        (input as any).admin = user.admin
        //returns false if passwords don't match
        return compare(input.password, user.password);
      }
      //user doesn't exist, schema rejects
      return false
    }, {message: "invalid email or password"})
}

