"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform_message = void 0;
const transform_message = (message) => {
    return {
        id: message.id,
        content: message.content,
        creation_date: message.creation_date,
        edition_date: message.edition_date,
        conversation_id: message.conversation_id,
        user_id: message.user_id
    };
};
exports.transform_message = transform_message;
//# sourceMappingURL=message.js.map