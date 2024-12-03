var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/index.js";
// import { Book } from "../models/index.js";
import { signToken } from '../services/auth.js'; // services folder should be '../utils/auth.js';
import { AuthenticationError } from 'apollo-server-express';
const resolvers = {
    Query: {
        me: (_parent, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            // If the user is authenticated, find and return the user's information along with their thoughts
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('savedBooks');
            }
            // If the user is not authenticated, throw an AuthenticationError
            throw new AuthenticationError('Could not authenticate user.');
        }),
    },
    // users: () => [{ id: "1", name: "John Doe", email: "john@example.com" }],
    // user: async (_parent: any, { username }: UserArgs) => {
    //   return User.findOne({ username }).populate('savedBooks');
    // }
    // users: async () => {
    //   return [{ id: "1", name: "Test User", email: "test@example.com" }];
    // }
    // users: async () => await User.find({}),
    // users: async () => {
    //   return await User.find({});
    // },
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
    //   users: () => __awaiter(void 0, void 0, void 0, function* () {
    //     return yield User.find({});
    // })
    Mutation: {
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
        // addUser: async (_parent: any, { username, email, password }: { username: string, email: string, password: string }) => {
        addUser: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { input }) {
            // Create a new user with the provided username, email, and password
            const { username, email, password } = input;
            const user = yield User.create({ username, email, password });
            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id); // (user)
            // Return the token and the user
            return { token, user };
        }),
        saveBook: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { book }, context) {
            if (context.user) {
                return User.findOneAndUpdate({ _id: context.user._id }, { $addToSet: { savedBooks: book } }, { new: true }).populate('savedBooks');
            }
            throw new AuthenticationError('You need to be logged in!');
        }),
        removeBook: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { bookId }, context) {
            if (context.user) {
                return User.findOneAndUpdate({ _id: context.user._id }, { $pull: { savedBooks: { bookId } } }, { new: true });
            }
            throw new AuthenticationError('You need to be logged in!');
        })
    }
};
export default resolvers;
