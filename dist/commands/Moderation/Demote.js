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
            adminOnly: true,
            command: 'demote',
            description: 'demotes the mentioned users',
            category: 'moderation',
            usage: `${client.config.prefix}demote [mention | @tag]`,
            baseXp: 0
        });
        this.run = (M) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!((_b = (_a = M.groupMetadata) === null || _a === void 0 ? void 0 : _a.admins) === null || _b === void 0 ? void 0 : _b.includes(this.client.user.jid)))
                return void M.reply(`❌ Failed to ${this.config.command} as I'm not an admin`);
            if ((_c = M.quoted) === null || _c === void 0 ? void 0 : _c.sender)
                M.mentioned.push(M.quoted.sender);
            if (!M.mentioned.length)
                return void M.reply(`Please tag the users you want to ${this.config.command}`);
            M.mentioned.forEach((user) => __awaiter(this, void 0, void 0, function* () {
                var _d, _e;
                const usr = this.client.contacts[user];
                const username = usr.notify || usr.vname || usr.name || user.split('@')[0];
                if (!((_e = (_d = M.groupMetadata) === null || _d === void 0 ? void 0 : _d.admins) === null || _e === void 0 ? void 0 : _e.includes(user)))
                    M.reply(`❌ Skipped *${username}* as they're not an admin`);
                else if (user !== this.client.user.jid) {
                    yield this.client.groupDemoteAdmin(M.from, [user]);
                    M.reply(`➰ Successfully Demoted *${username}*`);
                }
            }));
        });
    }
}
exports.default = Command;
