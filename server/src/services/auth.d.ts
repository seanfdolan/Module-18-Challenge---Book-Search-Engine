import { GraphQLError } from 'graphql';
export interface UserContext {
    user?: {
        username: string;
        email: string;
        _id: unknown;
    };
    token?: string;
}
export declare const authenticateToken: ({ req }: {
    req: any;
}) => UserContext;
export declare const signToken: (username: string, email: string, _id: unknown) => string;
export declare class AuthenticationError extends GraphQLError {
    constructor(message: string);
}
export declare const requireAuth: (next: Function) => (parent: any, args: any, context: UserContext, info: any) => any;
//# sourceMappingURL=auth.d.ts.map