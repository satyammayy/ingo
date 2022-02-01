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
const jimp_1 = __importDefault(require("jimp"));
class Command extends BaseCommand_1.default {
    constructor(client, handler) {
        super(client, handler, {
            command: 'blur',
            description: 'Blurs the given image or pfp',
            category: 'media',
            usage: `${client.config.prefix}blur [(as caption | quote)[image] | @mention]`,
            baseXp: 30
        });
        this.run = (M, { joined }) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const image = yield (((_b = (_a = M.WAMessage) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.imageMessage)
                ? this.client.downloadMediaMessage(M.WAMessage)
                : ((_e = (_d = (_c = M.quoted) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.message) === null || _e === void 0 ? void 0 : _e.imageMessage)
                    ? this.client.downloadMediaMessage(M.quoted.message)
                    : M.mentioned[0]
                        ? this.client.getProfilePicture(M.mentioned[0])
                        : this.client.getProfilePicture(((_f = M.quoted) === null || _f === void 0 ? void 0 : _f.sender) || M.sender.jid));
            if (!image)
                return void M.reply(`Couldn't fetch the required Image`);
            const level = joined.trim() || '5';
            const img = yield jimp_1.default.read(image);
            img.blur(isNaN(level) ? 5 : parseInt(level));
            img.getBuffer(`image/png`, (err, buffer) => {
                if (err)
                    return void M.reply((err === null || err === void 0 ? void 0 : err.message) || `Couldn't blur the image`);
                M.reply(buffer, baileys_1.MessageType.image);
            });
        });
    }
}
exports.default = Command;
