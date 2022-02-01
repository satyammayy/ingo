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
exports.toggleableGroupActions = void 0;
const baileys_1 = require("@adiwajshing/baileys");
const chalk_1 = __importDefault(require("chalk"));
const qr_image_1 = __importDefault(require("qr-image"));
const fs_1 = require("fs");
const moment_1 = __importDefault(require("moment"));
const path_1 = require("path");
const Utils_1 = __importDefault(require("./Utils"));
const DatabaseHandler_1 = __importDefault(require("../Handlers/DatabaseHandler"));
const axios_1 = __importDefault(require("axios"));
class WAClient extends baileys_1.WAConnection {
    constructor(config) {
        super();
        this.config = config;
        this.assets = new Map();
        this.DB = new DatabaseHandler_1.default();
        this.sendWA = (message) => __awaiter(this, void 0, void 0, function* () { return this.send(message); });
        this.getAuthInfo = (ID) => __awaiter(this, void 0, void 0, function* () {
            if ((0, fs_1.existsSync)(`./${ID}_session.json`))
                return require((0, path_1.join)(__dirname, '..', '..', `./${ID}_session.json`));
            const session = yield this.DB.session.findOne({ ID });
            if (!session)
                return null;
            return session.session;
        });
        this.saveAuthInfo = (ID) => __awaiter(this, void 0, void 0, function* () {
            const session = yield this.DB.session.findOne({ ID });
            if (!session)
                return void (yield new this.DB.session({ ID, session: this.base64EncodedAuthInfo() }).save());
            (0, fs_1.writeFileSync)(`./${ID}_session.json`, JSON.stringify(this.base64EncodedAuthInfo(), null, '\t'));
            this.log(chalk_1.default.green(`Saved AuthInfo!`));
            return void (yield this.DB.session.updateOne({ ID }, { $set: { session: this.base64EncodedAuthInfo() } }));
        });
        this.emitNewMessage = (M) => __awaiter(this, void 0, void 0, function* () { return void this.emit('new-message', yield M); });
        this.supportedMediaMessages = [baileys_1.MessageType.image, baileys_1.MessageType.video];
        this.simplifyMessage = (M) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            if ((_a = M.message) === null || _a === void 0 ? void 0 : _a.ephemeralMessage)
                M.message = M.message.ephemeralMessage.message;
            const jid = M.key.remoteJid || '';
            const chat = jid.endsWith('g.us') ? 'group' : 'dm';
            const type = (Object.keys(M.message || {})[0] || '');
            const user = chat === 'group' ? M.participant : jid;
            const info = this.getContact(user);
            const groupMetadata = chat === 'group' ? yield this.groupMetadata(jid) : null;
            if (groupMetadata)
                groupMetadata.admins = groupMetadata.participants.filter((user) => user.isAdmin).map((user) => user.jid);
            const sender = {
                jid: user,
                username: info.notify || info.vname || info.name || 'User',
                isAdmin: groupMetadata && groupMetadata.admins ? groupMetadata.admins.includes(user) : false
            };
            const content = type === baileys_1.MessageType.text && ((_b = M.message) === null || _b === void 0 ? void 0 : _b.conversation)
                ? M.message.conversation
                : this.supportedMediaMessages.includes(type)
                    ? this.supportedMediaMessages
                        .map((type) => { var _a, _b; return (_b = (_a = M.message) === null || _a === void 0 ? void 0 : _a[type]) === null || _b === void 0 ? void 0 : _b.caption; })
                        .filter((caption) => caption)[0] || ''
                    : type === baileys_1.MessageType.extendedText && ((_d = (_c = M.message) === null || _c === void 0 ? void 0 : _c.extendedTextMessage) === null || _d === void 0 ? void 0 : _d.text)
                        ? (_e = M.message) === null || _e === void 0 ? void 0 : _e.extendedTextMessage.text
                        : null;
            const quoted = {};
            quoted.message = ((_h = (_g = (_f = M === null || M === void 0 ? void 0 : M.message) === null || _f === void 0 ? void 0 : _f[type]) === null || _g === void 0 ? void 0 : _g.contextInfo) === null || _h === void 0 ? void 0 : _h.quotedMessage)
                ? (_j = JSON.parse(JSON.stringify(M).replace('quotedM', 'm')).message) === null || _j === void 0 ? void 0 : _j[type].contextInfo
                : null;
            quoted.sender = ((_m = (_l = (_k = M.message) === null || _k === void 0 ? void 0 : _k[type]) === null || _l === void 0 ? void 0 : _l.contextInfo) === null || _m === void 0 ? void 0 : _m.participant) || null;
            return {
                type,
                content,
                chat,
                sender,
                quoted,
                args: (content === null || content === void 0 ? void 0 : content.split(' ')) || [],
                reply: (content, type, mime, mention, caption, thumbnail) => __awaiter(this, void 0, void 0, function* () {
                    const options = {
                        quoted: M,
                        caption,
                        mimetype: mime,
                        contextInfo: { mentionedJid: mention }
                    };
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (thumbnail)
                        options.thumbnail = thumbnail;
                    yield this.sendMessage(jid, content, type || baileys_1.MessageType.text, options);
                }),
                mentioned: this.getMentionedUsers(M, type),
                from: jid,
                groupMetadata,
                WAMessage: M,
                urls: this.util.getUrls(content || '')
            };
        });
        this.log = (text, error) => {
            console.log(chalk_1.default[error ? 'red' : 'green']('[KAOI]'), chalk_1.default.blue((0, moment_1.default)(Date.now() * 1000).format('DD/MM HH:mm:ss')), chalk_1.default.yellowBright(text));
        };
        this.getMentionedUsers = (M, type) => {
            var _a, _b, _c, _d, _e;
            const notEmpty = (value) => value !== null && value !== undefined;
            const array = ((_c = (_b = (_a = M === null || M === void 0 ? void 0 : M.message) === null || _a === void 0 ? void 0 : _a[type]) === null || _b === void 0 ? void 0 : _b.contextInfo) === null || _c === void 0 ? void 0 : _c.mentionedJid)
                ? (_e = (_d = M === null || M === void 0 ? void 0 : M.message[type]) === null || _d === void 0 ? void 0 : _d.contextInfo) === null || _e === void 0 ? void 0 : _e.mentionedJid
                : [];
            return (array || []).filter(notEmpty);
        };
        //eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        this.getContact = (jid) => {
            return this.contacts[jid] || {};
        };
        this.getUser = (jid) => __awaiter(this, void 0, void 0, function* () {
            let user = yield this.DB.user.findOne({ jid });
            if (!user)
                user = yield new this.DB.user({
                    jid
                }).save();
            return user;
        });
        this.getBuffer = (url) => __awaiter(this, void 0, void 0, function* () { return (yield axios_1.default.get(url, { responseType: 'arraybuffer' })).data; });
        this.fetch = (url) => __awaiter(this, void 0, void 0, function* () { return (yield axios_1.default.get(url)).data; });
        this.banUser = (jid) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.DB.user.updateOne({ jid }, { $set: { ban: true } });
            if (!result.nModified)
                yield new this.DB.user({
                    jid,
                    ban: true
                }).save();
        });
        this.unbanUser = (jid) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.DB.user.updateOne({ jid }, { $set: { ban: false } });
            if (!result.nModified)
                yield new this.DB.user({
                    jid,
                    ban: false
                }).save();
        });
        this.setXp = (jid, min, max) => __awaiter(this, void 0, void 0, function* () {
            const Xp = Math.floor(Math.random() * max) + min;
            const result = yield this.DB.user.updateOne({ jid }, { $inc: { Xp } });
            if (!result.nModified)
                yield new this.DB.user({
                    jid,
                    Xp
                }).save();
        });
        this.modifyAllChats = (action) => __awaiter(this, void 0, void 0, function* () {
            const chats = this.chats.all();
            this.setMaxListeners(25);
            try {
                for (const chat of chats) {
                    yield this.modifyChat(chat.jid, action);
                }
                return { status: 200 };
            }
            catch (err) {
                return { status: 500 };
            }
        });
        this.util = new Utils_1.default();
        this.getGroupData = (jid) => __awaiter(this, void 0, void 0, function* () { return (yield this.DB.group.findOne({ jid })) || (yield new this.DB.group({ jid }).save()); });
        this.getFeatures = (feature) => __awaiter(this, void 0, void 0, function* () { return (yield this.DB.feature.findOne({ feature })) || (yield new this.DB.feature({ feature }).save()); });
        this.features = new Map();
        // set the values to the db
        this.setFeatures = () => __awaiter(this, void 0, void 0, function* () {
            const dbfeatures = yield this.DB.feature.find();
            for (const feature of dbfeatures) {
                this.features.set(feature.feature.toString(), feature.state);
            }
        });
        // get the value of a feature
        this.isFeature = (feature) => this.features.get(feature) || false;
        this.setFeature = (feature, value) => {
            this.features.set(feature, value);
        };
        this.browserDescription[0] = 'WhatsApp-Botto-Void';
        this.version = [3, 3234, 9];
        this.logger.level = 'fatal';
        this.on('chat-update', (update) => {
            if (!update.messages)
                return void null;
            const messages = update.messages.all();
            if (!messages[0])
                return void null;
            this.emitNewMessage(this.simplifyMessage(messages[0]));
        });
        this.on('qr', (qr) => {
            this.log(chalk_1.default.redBright(`Scan the QR code above to continue | You can also authenticate at http://localhost:${process.env.PORT || 4000}`));
            this.QR = qr_image_1.default.imageSync(qr);
        });
        this.on('CB:action,,call', (json) => __awaiter(this, void 0, void 0, function* () { return this.emit('call', json[2][0][1].from); }));
    }
}
exports.default = WAClient;
var toggleableGroupActions;
(function (toggleableGroupActions) {
    toggleableGroupActions["events"] = "events";
    toggleableGroupActions["NSFW"] = "nsfw";
    toggleableGroupActions["safe"] = "safe";
    toggleableGroupActions["mod"] = "mod";
    toggleableGroupActions["cmd"] = "cmd";
    toggleableGroupActions["invitelink"] = "invitelink";
})(toggleableGroupActions = exports.toggleableGroupActions || (exports.toggleableGroupActions = {}));
