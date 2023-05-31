"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
// process.env
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
const api_1 = __importDefault(require("./routers/api"));
const client_1 = __importDefault(require("./db/client"));
const log_entry_1 = __importDefault(require("./middlewares/log_entry"));
const log_exit_1 = __importDefault(require("./middlewares/log_exit"));
const send_1 = require("./scripts/send");
if (process.env.LOG !== 'true') {
    console = console || {};
    console.log = function () { };
}
client_1.default.sync({ force: process.env.FORCE_RELOAD_DB === 'true' })
    .then(() => console.log('-> Tables created!'))
    .catch(err => console.error('-> Error creating tables:', err));
const app = (0, express_1.default)();
// Logs
app.use(log_exit_1.default);
app.use(log_entry_1.default);
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('[info] [morgan]: :method :url :status :res[content-length]B - :response-time ms'));
// Router for api
app.use('/api', api_1.default);
// Default routes
app.get('/', (req, res) => res.sendFile('/index.html'));
app.get('*', (req, res) => (0, send_1.send_error)(res, 404, 'Not found'));
app.put('*', (req, res) => (0, send_1.send_error)(res, 405, 'Not allowed'));
app.post('*', (req, res) => (0, send_1.send_error)(res, 405, 'Not allowed'));
app.delete('*', (req, res) => (0, send_1.send_error)(res, 404, 'Not found'));
// starting app
app.listen(process.env.PORT, () => console.log(`-> API communications running on port ${process.env.PORT}`));
exports.default = app;
//# sourceMappingURL=app.js.map