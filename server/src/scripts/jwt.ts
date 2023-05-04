import jwt, { Secret } from 'jsonwebtoken';

const JWT_SECRET: Secret = (process.env.JWT_SECRET || '') as Secret;

export interface TokenPayload {
    id: number;
    username: string;
}

// Verify the JWT
export const verifyJwt = (token: string): Promise<TokenPayload> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded as TokenPayload);
        });
    });
};

// Sign and Create a new JWT
export const createJwt = (id: number, username: string, callback: (encoded?: string) => void): void => {
    jwt.sign({ id, username }, JWT_SECRET, (err: Error | null, encoded?: string) => {
        if (err) callback(undefined);
        else callback(encoded);
    });
};