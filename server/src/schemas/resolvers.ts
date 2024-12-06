import { login, saveBook } from "../controllers/user-controller.js";
import User from "../models/User.js";
import Book from "../models/Book.js";
import { signToken } from '../services/auth.js';  // services folder should be '../utils/auth.js';
import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { model } from "mongoose";

interface AddUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
  }  // UserArgs is the same as ProfileArgs
}

interface AddBookArgs {  // BookArgs is the same as SkillArgs. Should I keep it as BookArgs? or Delete it?
  input: {
    bookId: string;
    authors: string[];
    description: string;
    title: string;
    image: string;
    link: string;
  }
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface BookArgs {
  bookId: string;
}

// interface RemoveBookArgs {
//   bookId: string;
// }

const BookModel = model('Book', Book);

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      console.log('User:', context.user);

      // If the user is authenticated, find and return the user's information along with their thoughts
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      // If the user is not authenticated, throw an AuthenticationError
      throw new AuthenticationError('Could not authenticate user.');
    },
  },

  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {  // { username, email, password }: AddUserArgs
      const user = await User.create({ ...input });   //({ username, email, password })
      // Sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);
      // Return the token and the user
      return { token, user };
    },

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

    // saveBook: async (_parent: any, { authors, description, title, bookId, image, link}: SaveBookArgs, context: any) => {
    //   console.log("savebook",context.user,authors,description)
    //   const book ={authors, description, title, bookId, image, link}
    //   if (context.user) {
    //     return User.findOneAndUpdate(
    //       { _id: context.user._id },
    //       { $addToSet: { savedBooks: book } },
    //       { new: true }
    //     ).populate('savedBooks');
    //   }
    //   throw new AuthenticationError('You need to be logged in!');
    // },

    saveBook: async (_parent: any, { input }: AddBookArgs, context: any) => {
      if (context.user) {
        console.log('Received book data:', input); // log

        try {
          // Create the book
          const book = await BookModel.create(input);
          console.log('Created book:', book); // log

          // Update the user and add the book to their savedBooks
          const updatedUser = await User.findByIdAndUpdate(
            context.user._id,
            { $addToSet: { savedBooks: book._id } },
            { new: true, runValidators: true }
          ).populate('savedBooks');

          console.log('Updated user:', updatedUser); // log

          if (!updatedUser) {
            throw new Error('User not found');
          }

          // Return the newly created book, not the user
          return book;
        } catch (error) {
          console.error('Error in saveBook mutation:', error);
          throw new Error('Failed to save the book');
        }
      }
      throw new AuthenticationError('You need to be logged in!');
    },

  //   removeBook: async (_parent: any, { bookId }: RemoveBookArgs, context: any) => {
  //     if (context.user) {
  //       return User.findOneAndUpdate(
  //         { _id: context.user._id },
  //         { $pull: { savedBooks: { bookId } } },
  //         { new: true }
  //       );
  //     }
  //     throw new AuthenticationError('You need to be logged in!');
  //   }
  // }

  removeBook: async (_parent: any, { bookId }: BookArgs, context: any) => {
    if (context.user) {
      try {
        // Find the book by bookId, not _id
        const book = await BookModel.findOne({ bookId: bookId });

        if (!book) {
          throw new Error('No book found with this ID.');
        }

        // Remove the book from the user's savedBooks
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: book._id } },
          { new: true }
        ).populate('savedBooks');

        if (!updatedUser) {
          throw new Error('User not found');
        }

        console.log('Book removed:', book);
        console.log('Updated user:', updatedUser);

        return book; // Return the book that was removed
      } catch (error) {
        console.error('Error in removeBook mutation:', error);
        throw new Error('Failed to remove the book');
      }
    }
    throw new AuthenticationError('You need to be logged in!');
  },
}
};

export default resolvers;
