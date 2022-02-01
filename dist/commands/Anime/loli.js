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
const baileys_1 = require("@adiwajshing/baileys");
const BaseCommand_1 = __importDefault(require("../../lib/BaseCommand"));
const request_1 = __importDefault(require("../../lib/request"));
class Command extends BaseCommand_1.default {
    constructor(client, handler) {
        super(client, handler, {
            command: 'loli',
            description: 'Will send you random loli image',
            category: 'anime',
            usage: `${client.config.prefix}loli`
        });
        this.run = (M) => __awaiter(this, void 0, void 0, function* () {
            const onefive = Math.floor(Math.random() * 145) + 1;
            return void M.reply(yield request_1.default.buffer(`https://media.publit.io/file/Twintails/${onefive}.jpg`), baileys_1.MessageType.image, undefined, undefined, `*Niko Niko Ni*`);
        });
    }
}
exports.default = Command;
