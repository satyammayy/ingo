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
const BaseCommand_1 = __importDefault(require("../../lib/BaseCommand"));
class Command extends BaseCommand_1.default {
    constructor(client, handler) {
        super(client, handler, {
            command: 'infinity',
            description: 'Displays the info',
            category: 'bots',
            usage: `${client.config.prefix}infinity`,
            baseXp: 100
        });
        this.run = (M) => __awaiter(this, void 0, void 0, function* () {
            return void M.reply(`š¾ *Infinity* š¾\n\nš *Description:* The Multi-purpose Bot With Biggest User Base\n\nš *URL:* https://github.com/AlenSaito1/Whatsapp-Botto-Infinity\n`).catch((reason) => M.reply(`an error occurred, Reason: ${reason}`));
        });
    }
}
exports.default = Command;
