import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();
export const authenticateToken = ({ req }) => {
    // Allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
    const context = {};
    // If the token is sent in the authorization header, extract the token from the header
    if (req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }
    // If no token is provided, return the request object as is
    if (!token) {
        return context; // context was req
    }
    // Try to verify the token
    try {
        const { data } = jwt.verify(token, process.env.JWT_SECRET_KEY || '');
        context.user = data;
        context.token = token;
        return context;
    }
    catch (err) {
        throw new AuthenticationError('Invalid or expired token');
    }
};
export const signToken = (username, email, _id) => {
    // Create a payload with the user information
    const payload = { username, email, _id };
    const secretKey = process.env.JWT_SECRET_KEY; // Get the secret key from environment variables
    if (!secretKey) {
        throw new Error('JWT_SECRET_KEY is not defined in environment variables');
    }
    // Sign the token with the payload and secret key, and set it to expire in 2 hours
    return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};
export class AuthenticationError extends GraphQLError {
    // constructor(message: string) {
    //   super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    //   Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
    constructor(message) {
        super(message);
        Object.assign(this.extensions, {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
        });
        Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
    }
}
;
export const requireAuth = (next) => (parent, args, context, info) => {
    if (!context.user) {
        throw new AuthenticationError('You must be logged in to do that.');
    }
    return next(parent, args, context, info);
};
//# sourceMappingURL=auth.js.map