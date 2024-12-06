interface AddUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
    };
}
interface AddBookArgs {
    input: {
        bookId: string;
        authors: string[];
        description: string;
        title: string;
        image: string;
        link: string;
    };
}
interface LoginUserArgs {
    email: string;
    password: string;
}
interface BookArgs {
    bookId: string;
}
declare const resolvers: {
    Query: {
        me: (_parent: any, _args: any, context: any) => Promise<(import("mongoose").Document<unknown, {}, import("../models/User.js").UserDocument> & import("../models/User.js").UserDocument & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }) | null>;
    };
    Mutation: {
        addUser: (_parent: any, { input }: AddUserArgs) => Promise<{
            token: string;
            user: import("mongoose").Document<unknown, {}, import("../models/User.js").UserDocument> & import("../models/User.js").UserDocument & Required<{
                _id: unknown;
            }> & {
                __v: number;
            };
        }>;
        login: (_parent: any, { email, password }: LoginUserArgs) => Promise<{
            token: string;
            user: import("mongoose").Document<unknown, {}, import("../models/User.js").UserDocument> & import("../models/User.js").UserDocument & Required<{
                _id: unknown;
            }> & {
                __v: number;
            };
        }>;
        saveBook: (_parent: any, { input }: AddBookArgs, context: any) => Promise<import("mongoose").Document<unknown, {}, import("../models/Book.js").BookDocument> & import("../models/Book.js").BookDocument & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }>;
        removeBook: (_parent: any, { bookId }: BookArgs, context: any) => Promise<import("mongoose").Document<unknown, {}, import("../models/Book.js").BookDocument> & import("../models/Book.js").BookDocument & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }>;
    };
};
export default resolvers;
//# sourceMappingURL=resolvers.d.ts.map