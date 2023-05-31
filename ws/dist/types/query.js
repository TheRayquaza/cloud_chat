"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform_query = void 0;
const transform_query = (request) => {
    if (request.type === "auth")
        return {
            type: request.type,
            content: JSON.parse(request.content),
            user: null,
            action: request.action,
            sender: request.sender,
            recipient: request.recipient
        };
    return {
        type: request.type,
        content: JSON.parse(request.content),
        user: JSON.parse(request.user),
        action: request.action,
        sender: request.sender,
        recipient: request.recipient
    };
};
exports.transform_query = transform_query;
//# sourceMappingURL=query.js.map