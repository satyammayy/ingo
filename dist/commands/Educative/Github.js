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
const axios_1 = __importDefault(require("axios"));
const BaseCommand_1 = __importDefault(require("../../lib/BaseCommand"));
class Command extends BaseCommand_1.default {
    constructor(client, handler) {
        super(client, handler, {
            command: 'github',
            aliases: ['gh'],
            description: 'Get github information about a user/repo',
            category: 'educative',
            usage: `${client.config.prefix}github`
        });
        this.run = (M, { joined }) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const terms = joined.trim().split('/');
            if (terms[0] === '')
                return void M.reply(`Arguments not found : Use ${this.client.config.prefix}gh (username/repo | username)`);
            const username = terms[0];
            const repo = terms.length > 1 ? terms[1] : null;
            let text = '';
            if (!repo) {
                const userInfo = yield axios_1.default
                    .get(`https://api.github.com/users/${username}`)
                    .then((res) => res.data)
                    .catch((err) => {
                    console.log(err);
                    return void M.reply('🟥 ERROR 🟥\n Failed to fetch the User');
                });
                if (userInfo === undefined) {
                    return void M.reply('🟥 ERROR 🟥\n Failed to fetch the User');
                }
                // prepare text information
                text += `*🐙 Link :* http://github.com/${username}\n`;
                text += `*📝 Name:* ${userInfo.name}\n`;
                if (userInfo.email !== null)
                    text += `*📧 Email:* ${userInfo.email}\n`;
                if (userInfo.location !== null)
                    text += `*📍 Location:* ${userInfo.location}\n`;
                if (userInfo.bio !== null)
                    text += `*ℹ️ Bio:* ${userInfo.bio}\n`;
                text += `*👥 Followers:* ${userInfo.followers}\n*👥 Following:* ${userInfo.following}\n`;
                text += `*🎒 Repositories:* ${userInfo.public_repos}\n`;
                return void M.reply(text);
            }
            else {
                const repoInfo = yield axios_1.default
                    .get(`https://api.github.com/repos/${username}/${repo}`)
                    .then((res) => res.data)
                    .catch((err) => {
                    console.log(err);
                    return void M.reply('🟥 ERROR 🟥\n Failed to fetch the Repo');
                });
                if (repoInfo === undefined) {
                    return void M.reply('🟥 ERROR 🟥\n Failed to fetch the Repo');
                }
                // prepare text information
                text += `*🐙 Link :* http://github.com/${username}/${repo}\n`;
                text += `*🎒 Repository Name :* ${repoInfo.name}\n`;
                text += `*ℹ️ Description:* ${(_a = repoInfo.description) !== null && _a !== void 0 ? _a : '-'}\n`;
                text += `*📜 Licence:* ${repoInfo.license.name}\n`;
                text += `*🌟 Stars:* ${repoInfo.stargazers_count}\n`;
                text += `*💻 Language:* ${repoInfo.language}\n`;
                text += `*🍴 Forks:* ${repoInfo.forks_count}\n`;
                text += `*⚠️ Issues:* ${repoInfo.open_issues_count}\n`;
                text += `*📅 Created:* ${repoInfo.created_at}\n`;
                text += `*📅 Updated:* ${repoInfo.updated_at.slice(0, 11)}\n`;
                return void M.reply(text);
            }
        });
    }
}
exports.default = Command;
