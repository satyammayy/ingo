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
            command: 'mods',
            description: "Displays the Moderators' contact info",
            category: 'general',
            usage: `${client.config.prefix}mods`,
            aliases: ['moderators', 'mod', 'owner'],
            baseXp: 40
        });
        this.run = (M) => __awaiter(this, void 0, void 0, function* () {
            if (!this.client.config.mods || !this.client.config.mods[0])
                return void M.reply('*No Mods Set*');
            const filteredMap = this.client.config.mods.map((mod) => this.client.getContact(mod)).filter((user) => user);
            let text = '🍥 *Moderators* 🍥\n\n';
            filteredMap.forEach((user, index) => {
                var _a;
                return (text += `#${index + 1}\n🎫 *Username: ${user.notify || user.vname || user.name || 'null'}*\n🍀 *Contact: https://wa.me/+${(_a = user === null || user === void 0 ? void 0 : user.jid) === null || _a === void 0 ? void 0 : _a.split('@')[0]}*\n\n`);
            });
            text += `\nTo deploy your own Bot or To support Kaoi👾\nVisit : https://github.com/PrajjwalDatir/Kaoi `;
            return void M.reply(text);
        });
    }
}
exports.default = Command;
