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
            command: 'guide',
            description: 'Lists All Kaoi Guides',
            category: 'bots',
            usage: `${client.config.prefix}guide`,
            baseXp: 200
        });
        this.run = (M) => __awaiter(this, void 0, void 0, function* () {
            let text = '';
            text += '*👾 Kaoi 👾*\n';
            text += '*🔗 README* : https://github.com/PrajjwalDatir/Kaoi#readme\n';
            text += '*🔗 FEATURES* : https://github.com/PrajjwalDatir/Kaoi/blob/main/Features.md\n';
            text += '*🔗 CONTRIBUTERS* : https://github.com/PrajjwalDatir/Kaoi/graphs/contributors\n';
            text += '*🔗 FAQ* : https://github.com/PrajjwalDatir/Kaoi/blob/main/Troubleshooting%20and%20faq.md\n';
            text += '\n*👾 DEPLOY GUIDES 👾*\n';
            text += `*🔗 Deploy Video Guide 🔗 : https://www.youtube.com/watch?v=tsCCmxeklHw*
            Follow this video Guide but instead of using the *WhatsApp Botto Xre* Link, use the *Kaoi Github Link* given above.\n`;
            text += '🔗 Deploy Text Guide (Detailed) 🔗 : https://github.com/Hiroto77/Kaoi-Guides#readme\n';
            text += '\n👾 SPECIFIC GUIDES 👾\n';
            text += '🔗 How to get the ChatBot URL : https://github.com/Hiroto77/Kaoi-Guides/blob/main/Chat_Bot_Url.md\n';
            text += `🔗 How to use ${this.client.config.prefix}sticker effectively : https://github.com/Hiroto77/Kaoi-Guides/blob/main/Sticker-feature-Guide.md\n`;
            text +=
                '🔗 How to get the MongoDB URL : https://github.com/Hiroto77/Kaoi-Guides/blob/main/Mongo-Atlas-guide.md\n';
            text += '🔗 App sleeping? : https://www.youtube.com/watch?v=B9SvhFWKloM\n';
            text += '\n_Thank You for using Kaoi. Help others setup Kaoi by contribution to Kaoi Guides_';
            return void M.reply(text).catch((reason) => M.reply(`an error occurred, Reason: ${reason}`));
        });
    }
}
exports.default = Command;
