"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_handler = (ws, message) => {
    switch (message.action) {
        case "created":
        case "updated":
        case "deleted":
        case "default":
            console.log(message);
    }
};
exports.default = message_handler;
//# sourceMappingURL=message_handler.js.map