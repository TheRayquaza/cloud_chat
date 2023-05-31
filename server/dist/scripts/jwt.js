"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJwt = exports.verifyJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = (process.env.JWT_SECRET || '');
// Verify the JWT
const verifyJwt = (token) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
            if (err)
                reject(err);
            else
                resolve(decoded);
        });
    });
};
exports.verifyJwt = verifyJwt;
// Sign and Create a new JWT
const createJwt = (id, username) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign({ id, username }, JWT_SECRET, (err, encoded) => {
            if (err)
                reject(err);
            else
                resolve(encoded);
        });
    });
};
exports.createJwt = createJwt;
//# sourceMappingURL=jwt.js.map