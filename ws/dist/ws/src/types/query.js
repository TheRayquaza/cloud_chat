"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform_query = void 0;
const transform_query = (request) => {
    return {
        type: request.type,
        content: request.content,
        user: request.user,
        action: request.action,
        sender: request.sender,
        recipient: request.recipient
    };
};
exports.transform_query = transform_query;
//# sourceMappingURL=query.js.map