"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform_conversation = void 0;
const transform_conversation = (conversation) => {
    return {
        admin_id: conversation.admin_id,
        id: conversation.id,
        name: conversation.name,
        creation_date: conversation.creation_date,
        edition_date: conversation.edition_date
    };
};
exports.transform_conversation = transform_conversation;
//# sourceMappingURL=conversation.js.map