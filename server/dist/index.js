"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const logic_1 = require("./logic");
const orm_1 = require("./orm");
const server_1 = require("./server");
const orm = new orm_1.default(config_1.default.mongoose);
const logic = new logic_1.default(orm);
const server = new server_1.default(orm, logic);
orm.connect();
server.listen(config_1.default.port);
//# sourceMappingURL=index.js.map