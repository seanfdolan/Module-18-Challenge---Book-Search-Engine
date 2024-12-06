import type { Request, Response } from 'express';
export declare const getSingleUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const saveBook: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteBook: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=user-controller.d.ts.map