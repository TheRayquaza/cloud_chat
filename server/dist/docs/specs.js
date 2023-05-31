"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const responses_1 = __importDefault(require("./responses"));
const parameters_1 = __importDefault(require("./parameters"));
const schemas_1 = __importDefault(require("./schemas"));
const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Loqui Express API with Swagger",
            version: "0.1.0",
            description: "This is a simple CRUD API application made with Express and documented with Swagger",
            license: {
                name: "GPL V3",
                url: "https://www.gnu.org/licenses/gpl-3.0.en.html",
            },
            contact: {
                name: "Mateo Lelong",
                email: "mateo.lelong@gmail.com",
            },
        },
        servers: [
            {
                url: process.env.FULL_NAME_WS,
            },
        ],
    },
    apis: ["src/routers/*.js"],
    components: {
        schemas: schemas_1.default,
        parameters: parameters_1.default,
        responses: responses_1.default,
    },
};
exports.default = (0, swagger_jsdoc_1.default)(options);
