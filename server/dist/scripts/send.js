"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_success = exports.send_result = exports.send_error = void 0;
const logger_1 = require("../logger");
const send_error = (res, status, msg) => {
    logger_1.script_logger.info("final response : " + msg);
    res.status(status).json({ status: status, error: msg });
};
exports.send_error = send_error;
const send_result = (res, status, content) => {
    logger_1.script_logger.info("finale response : result sent with content \n" + JSON.stringify(content, null, 2) + "\n");
    res.status(status).json(content);
};
exports.send_result = send_result;
const send_success = (res, status = 200) => {
    logger_1.script_logger.info("final response : request done with success");
    res.status(status).json({ status: status, success: true });
};
exports.send_success = send_success;
//# sourceMappingURL=send.js.map