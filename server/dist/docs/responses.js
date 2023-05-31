"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    UserNotFoundError: {
        description: "The requested user was not found",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        error: {
                            type: "string",
                            example: "user not found",
                        },
                    },
                },
            },
        },
    },
    BadRequestError: {
        description: "The request was malformed or invalid",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        error: {
                            type: "string",
                            example: "bad request",
                        },
                    },
                },
            },
        },
    },
    InternalServerError: {
        description: "An unexpected error occurred",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        error: {
                            type: "string",
                            example: "unable to access the db",
                        },
                    },
                },
            },
        },
    },
    UnauthorizedError: {
        description: "Unauthorized access",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        error: {
                            type: "string",
                            example: "Permission of this user is invalid",
                        },
                    },
                },
            },
        },
    }
};
