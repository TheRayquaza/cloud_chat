"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform_request = void 0;
const transform_request = (request) => {
    return {
        type: request.type,
        content: request.content,
        action: request.action,
        sender: request.sender,
        recipient: request.recipient
    };
};
exports.transform_request = transform_request;
//# sourceMappingURL=request.js.map