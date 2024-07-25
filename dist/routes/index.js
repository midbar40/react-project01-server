"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.websearchRouter = exports.userRouter = void 0;
var users_1 = require("./users");
Object.defineProperty(exports, "userRouter", { enumerable: true, get: function () { return __importDefault(users_1).default; } });
var websearch_1 = require("./websearch");
Object.defineProperty(exports, "websearchRouter", { enumerable: true, get: function () { return __importDefault(websearch_1).default; } });
