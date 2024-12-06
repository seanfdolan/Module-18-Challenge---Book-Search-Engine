interface JwtPayload {
    _id: unknown;
    username: string;
    email: string;
}
export declare const signToken: (username: string, email: string, _id: unknown) => string;
export declare const authenticateToken: (authHeader: string | undefined) => JwtPayload;
import type { Request } from "express";
export declare const context: ({ req }: {
    req: Request;
}) => {
    user: JwtPayload;
} | {
    user?: undefined;
};
export {};
//# sourceMappingURL=oldauth.d.ts.map