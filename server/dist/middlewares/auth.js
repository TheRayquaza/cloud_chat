"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const logger_1 = require("../logger");
const jwt_1 = require("../scripts/jwt");
const send_1 = require("../scripts/send");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    logger_1.middleware_logger.info("authentification");
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token)
        (0, send_1.send_error)(res, 401, 'No token provided');
    else {
        // Verify JWT and extract user data
        try {
            const decoded = yield (0, jwt_1.verifyJwt)(token);
            if (!decoded)
                (0, send_1.send_error)(res, 401, 'Invalid token');
            else {
                req.headers["X-id"] = decoded.id.toString();
                req.headers["X-username"] = decoded.username;
                next();
            }
        }
        catch (err) {
            logger_1.middleware_logger.error(err);
            (0, send_1.send_error)(res, 401, 'Invalid token');
        }
    }
});
exports.auth = auth;
//# sourceMappingURL=auth.js.map