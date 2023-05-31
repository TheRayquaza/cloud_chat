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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_perm = void 0;
const { middleware_logger } = require('../logger');
const { send_error } = require('../scripts/send');
const user_1 = __importDefault(require("../db/user"));
const user_perm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    middleware_logger.info("user permissions for user " + req.headers["X-id"]);
    const id = req.headers["X-id"];
    const user = yield user_1.default.findByPk(parseInt(id));
    if (!user || user.dataValues.permission != 1)
        send_error(res, 401, 'Unauthorized access');
    else
        next();
});
exports.user_perm = user_perm;
//# sourceMappingURL=user_perm.js.map