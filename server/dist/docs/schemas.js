"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    User: {
        type: "object",
        properties: {
            id: {
                type: "integer",
            },
            username: {
                type: "string",
            },
            password_hash: {
                type: "string",
            },
            permission: {
                type: "integer",
            },
        },
        required: ["id", "username", "password_hash", "permission"],
    },
    UserData: {
        type: "object",
        properties: {
            username: {
                type: "string",
            },
            password: {
                type: "string",
            },
        },
        required: ["username", "password"],
    },
};
