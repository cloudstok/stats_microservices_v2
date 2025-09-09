import jwt, { type SignOptions, type JwtPayload } from "jsonwebtoken";

const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY as string; // e.g. "1h" or "3600s"

export const generateAccessToken = (payload: Record<string, string | number>) => {
    return jwt.sign(payload, TOKEN_SECRET, {
        expiresIn: TOKEN_EXPIRY,
    } as SignOptions);
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, TOKEN_SECRET) as JwtPayload;
};
