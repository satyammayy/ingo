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
const chalk_1 = __importDefault(require("chalk"));
const path_1 = require("path");
class MessageHandler {
    constructor(client) {
        this.client = client;
        this.commands = new Map();
        this.aliases = new Map();
        this.handleMessage = (M) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            if (!(M.chat === 'dm') && M.WAMessage.key.fromMe && M.WAMessage.status.toString() === '2') {
                /*
                BUG : It receives message 2 times and processes it twice.
                https://github.com/adiwajshing/Baileys/blob/8ce486d/WAMessage/WAMessage.d.ts#L18529
                https://adiwajshing.github.io/Baileys/enums/proto.webmessageinfo.webmessageinfostatus.html#server_ack
                */
                M.sender.jid = this.client.user.jid;
                M.sender.username = this.client.user.name || this.client.user.vname || this.client.user.short || 'Satyam Bot';
            }
            else if (M.WAMessage.key.fromMe)
                return void null;
            if (M.from.includes('status'))
                return void null;
            const { args, groupMetadata, sender } = M;
            if (M.chat === 'dm' && this.client.isFeature('chatbot')) {
                if (this.client.config.chatBotUrl) {
                    const myUrl = new URL(this.client.config.chatBotUrl);
                    const params = myUrl.searchParams;
                    yield axios_1.default
                        .get(`${encodeURI(`http://api.brainshop.ai/get?bid=${params.get('bid')}&key=${params.get('key')}&uid=${M.sender.jid}&msg=${M.args}`)}`)
                        .then((res) => {
                        if (res.status !== 200)
                            return void M.reply(`🔍 Error: ${res.status}`);
                        return void M.reply(res.data.cnt);
                    })
                        .catch(() => {
                        M.reply(`Ummmmmmmmm.`);
                    });
                }
            }
            if (!M.groupMetadata && !(M.chat === 'dm'))
                return void null;
            if ((yield this.client.getGroupData(M.from)).mod && ((_b = (_a = M.groupMetadata) === null || _a === void 0 ? void 0 : _a.admins) === null || _b === void 0 ? void 0 : _b.includes(this.client.user.jid)))
                this.moderate(M);
            if (!args[0] || !args[0].startsWith(this.client.config.prefix))
                return void this.client.log(`${chalk_1.default.blueBright('MSG')} from ${chalk_1.default.green(sender.username)} in ${chalk_1.default.cyanBright((groupMetadata === null || groupMetadata === void 0 ? void 0 : groupMetadata.subject) || '')}`);
            const cmd = args[0].slice(this.client.config.prefix.length).toLowerCase();
            // If the group is set to muted, don't do anything
            const allowedCommands = ['activate', 'deactivate', 'act', 'deact'];
            if (!(allowedCommands.includes(cmd) || (yield this.client.getGroupData(M.from)).cmd))
                return void this.client.log(`${chalk_1.default.green('CMD')} ${chalk_1.default.yellow(`${args[0]}[${args.length - 1}]`)} from ${chalk_1.default.green(sender.username)} in ${chalk_1.default.cyanBright((groupMetadata === null || groupMetadata === void 0 ? void 0 : groupMetadata.subject) || 'DM')}`);
            const command = this.commands.get(cmd) || this.aliases.get(cmd);
            this.client.log(`${chalk_1.default.green('CMD')} ${chalk_1.default.yellow(`${args[0]}[${args.length - 1}]`)} from ${chalk_1.default.green(sender.username)} in ${chalk_1.default.cyanBright((groupMetadata === null || groupMetadata === void 0 ? void 0 : groupMetadata.subject) || 'DM')}`);
            if (!command)
                return void M.reply('No Command Found! Try using one from the help list.');
            const user = yield this.client.getUser(M.sender.jid);
            if (user.ban)
                return void M.reply("You're Banned from using commands.");
            const state = yield this.client.DB.disabledcommands.findOne({ command: command.config.command });
            if (state)
                return void M.reply(`❌ This command is disabled${state.reason ? ` for ${state.reason}` : ''}`);
            if (!((_c = command.config) === null || _c === void 0 ? void 0 : _c.dm) && M.chat === 'dm')
                return void M.reply('This command can only be used in groups');
            if (((_d = command.config) === null || _d === void 0 ? void 0 : _d.modsOnly) && !((_e = this.client.config.mods) === null || _e === void 0 ? void 0 : _e.includes(M.sender.jid))) {
                return void M.reply(`Only MODS are allowed to use this command`);
            }
            if (((_f = command.config) === null || _f === void 0 ? void 0 : _f.adminOnly) && !M.sender.isAdmin)
                return void M.reply(`Only admins are allowed to use this command`);
            try {
                yield command.run(M, this.parseArgs(args));
                if (command.config.baseXp) {
                    yield this.client.setXp(M.sender.jid, command.config.baseXp || 10, 50);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (err) {
                return void this.client.log(err.message, true);
            }
        });
        this.moderate = (M) => __awaiter(this, void 0, void 0, function* () {
            if (M.sender.isAdmin)
                return void null;
            if (M.urls.length) {
                const groupinvites = M.urls.filter((url) => url.includes('chat.whatsapp.com'));
                if (groupinvites.length) {
                    groupinvites.forEach((invite) => __awaiter(this, void 0, void 0, function* () {
                        var _g;
                        const splitInvite = invite.split('/');
                        const z = yield this.client.groupInviteCode(M.from);
                        if (z !== splitInvite[splitInvite.length - 1]) {
                            this.client.log(`${chalk_1.default.blueBright('MOD')} ${chalk_1.default.green('Group Invite')} by ${chalk_1.default.yellow(M.sender.username)} in ${((_g = M.groupMetadata) === null || _g === void 0 ? void 0 : _g.subject) || ''}`);
                            return void (yield this.client.groupRemove(M.from, [M.sender.jid]));
                        }
                    }));
                }
            }
        });
        this.loadCommands = () => {
            this.client.log(chalk_1.default.green('Loading Commands...'));
            const path = (0, path_1.join)(__dirname, '..', 'commands');
            const files = this.client.util.readdirRecursive(path);
            files.map((file) => {
                const filename = file.split('/');
                if (!filename[filename.length - 1].startsWith('_')) {
                    //eslint-disable-next-line @typescript-eslint/no-var-requires
                    const command = new (require(file).default)(this.client, this);
                    this.commands.set(command.config.command, command);
                    if (command.config.aliases)
                        command.config.aliases.forEach((alias) => this.aliases.set(alias, command));
                    this.client.log(`Loaded: ${chalk_1.default.green(command.config.command)} from ${chalk_1.default.green(file)}`);
                    return command;
                }
            });
            this.client.log(`Successfully Loaded ${chalk_1.default.greenBright(this.commands.size)} Commands`);
        };
        this.loadFeatures = () => {
            this.client.log(chalk_1.default.green('Loading Features...'));
            this.client.setFeatures().then(() => {
                this.client.log(`Successfully Loaded ${chalk_1.default.greenBright(this.client.features.size)} Features`);
            });
        };
        this.parseArgs = (args) => {
            const slicedArgs = args.slice(1);
            return {
                args: slicedArgs,
                flags: slicedArgs.filter((arg) => arg.startsWith('--')),
                joined: slicedArgs.join(' ').trim()
            };
        };
    }
}
exports.default = MessageHandler;
