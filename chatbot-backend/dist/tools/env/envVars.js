"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env_vars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pe = process.env;
const env_vars = {
    PORT: Number(pe.PORT),
};
exports.env_vars = env_vars;
for (const [key, val] of Object.entries(env_vars)) {
    if (val == undefined) {
        throw new Error(`Expected environment variable \"${key}\" to be defined`);
    }
}
if (isNaN(env_vars.PORT)) {
    throw new Error(`env_vars PORT is NaN`);
}
