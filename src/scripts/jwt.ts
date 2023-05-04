import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

// Verify the JWT
const verifyJwt = (token: string, callback: (decoded?: { id: string, username: string }) => void): void => {
    if (!token) callback(undefined)
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) callback(undefined)
        else callback(decoded as { id: string, username: string })
    })
}

// Sign and Create a new JWT
const createJwt = (id: string, username: string, callback: (encoded?: string) => void): void => {
    jwt.sign({id, username}, JWT_SECRET, (err, encoded) => {
        if (err) callback(undefined)
        else callback(encoded)
    })
}

export { verifyJwt, createJwt };
