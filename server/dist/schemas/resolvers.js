var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/User.js";
import Book from "../models/Book.js";
import { signToken } from '../services/auth.js'; // services folder should be '../utils/auth.js';
import { AuthenticationError } from 'apollo-server-express';
import { model } from "mongoose";
// interface RemoveBookArgs {
//   bookId: string;
// }
const BookModel = model('Book', Book);
const resolvers = {
    Query: {
        me: (_parent, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('User:', context.user);
            // If the user is authenticated, find and return the user's information along with their thoughts
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('savedBooks');
            }
            // If the user is not authenticated, throw an AuthenticationError
            throw new AuthenticationError('Could not authenticate user.');
        }),
    },
    Mutation: {
        addUser: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { input }) {
            const user = yield User.create(Object.assign({}, input)); //({ username, email, password })
            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);
            // Return the token and the user
            return { token, user };
        }),
        // login: async (_parent: any, { email, password }: { email: string, password: string}) => {
        login: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { email, password }) {
            // Find a user with the provided email
            const user = yield User.findOne({ email });
            // If no user is found, throw an AuthenticationError
            if (!user) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            // Check if the provided password is correct
            const correctPw = yield user.isCorrectPassword(password);
            // If the password is incorrect, throw an AuthenticationError
            if (!correctPw) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id); // (user)
            // Return the token and the user
            return { token, user };
        }),
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
        saveBook: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { input }, context) {
            if (context.user) {
                console.log('Received book data:', input); // log
                try {
                    // Create the book
                    const book = yield BookModel.create(input);
                    console.log('Created book:', book); // log
                    // Update the user and add the book to their savedBooks
                    const updatedUser = yield User.findByIdAndUpdate(context.user._id, { $addToSet: { savedBooks: book._id } }, { new: true, runValidators: true }).populate('savedBooks');
                    console.log('Updated user:', updatedUser); // log
                    if (!updatedUser) {
                        throw new Error('User not found');
                    }
                    // Return the newly created book, not the user
                    return book;
                }
                catch (error) {
                    console.error('Error in saveBook mutation:', error);
                    throw new Error('Failed to save the book');
                }
            }
            throw new AuthenticationError('You need to be logged in!');
        }),
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
        removeBook: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { bookId }, context) {
            if (context.user) {
                try {
                    // Find the book by bookId, not _id
                    const book = yield BookModel.findOne({ bookId: bookId });
                    if (!book) {
                        throw new Error('No book found with this ID.');
                    }
                    // Remove the book from the user's savedBooks
                    const updatedUser = yield User.findByIdAndUpdate(context.user._id, { $pull: { savedBooks: book._id } }, { new: true }).populate('savedBooks');
                    if (!updatedUser) {
                        throw new Error('User not found');
                    }
                    console.log('Book removed:', book);
                    console.log('Updated user:', updatedUser);
                    return book; // Return the book that was removed
                }
                catch (error) {
                    console.error('Error in removeBook mutation:', error);
                    throw new Error('Failed to remove the book');
                }
            }
            throw new AuthenticationError('You need to be logged in!');
        }),
    }
};
export default resolvers;
//# sourceMappingURL=resolvers.js.map