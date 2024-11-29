
import { login, saveBook } from "../controllers/user-controller.js";
import User from "../models/index.js";
// import { Book } from "../models/index.js";
import { signToken } from '../services/auth.js';  // services folder should be '../utils/auth.js';
import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

interface UserArgs {  // UserArgs is the same as ProfileArgs
  _id: string;
  username: string;
  email: string;
  bookCount: number;
  savedBooks: string[];
}
  
// interface BookArgs {  // BookArgs is the same as SkillArgs. Should I keep it as BookArgs? or Delete it?
//   bookId: string;
//   authors: string[];
//   description: string;
//   title: string;
//   image: string;
//   link: string;
// }


interface LoginUserArgs {
  email: string;
  password: string;
}
interface AddUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
  };
}
interface SaveBookArgs {
  book: {
    authors: string[];
    description: string;
    title: string;
    bookId: string;
    image: string;
    link: string;
  };
}
interface RemoveBookArgs {
  bookId: string;
}

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      // If the user is authenticated, find and return the user's information along with their thoughts
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      // If the user is not authenticated, throw an AuthenticationError
      throw new AuthenticationError('Could not authenticate user.');
    },
  },

    users: async () => {
      return await User.find({});
    },
    user: async (_parent: any, { username }: UserArgs) => {
      return User.findOne({ username }).populate('savedBooks');
    },
    
    // users: async () => {
    //   try {
    //     const users = await User.find({});
    //     return users;
    //   } catch (error) {
    //     console.error(error);
    //     throw new Error('Cannot find users');
    //   }

    // users: async(_parent: any, _args: any, context: any, {username}: UserArgs) => {
    //       return await User.findOne({username: context.user.username}).populate('savedBooks');
    //     }
    //   },

  Mutation: {
    // login: async (_parent: any, { email, password }: { email: string, password: string}) => {
    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      // Find a user with the provided email
      const user = await User.findOne({ email });
    
      // If no user is found, throw an AuthenticationError
      if (!user) {
        throw new AuthenticationError('Could not authenticate user.');
      }
    
      // Check if the provided password is correct
      const correctPw = await user.isCorrectPassword(password);
    
      // If the password is incorrect, throw an AuthenticationError
      if (!correctPw) {
        throw new AuthenticationError('Could not authenticate user.');
      }
    
      // Sign a token with the user's information
      const token = signToken(user.username, user.email, user._id); // (user)
    
      // Return the token and the user
      return { token, user };
    },
  },
  
    // addUser: async (_parent: any, { username, email, password }: { username: string, email: string, password: string }) => {
    addUser: async (_parent: any, { input }: AddUserArgs) => {  
      // Create a new user with the provided username, email, and password
      const { username, email, password } = input;
      const user = await User.create({ username, email, password });
      // Sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);  // (user)
      // Return the token and the user
      return { token, user };
    },

    saveBook: async (_parent: any, { book }: SaveBookArgs, context: any) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: book } },
          { new: true }
        ).populate('savedBooks');
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    removeBook: async (_parent: any, { bookId }: RemoveBookArgs, context: any) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    }
  };

export default resolvers;
