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
const axios_1 = __importDefault(require("axios"));
class Command extends BaseCommand_1.default {
    constructor(client, handler) {
        super(client, handler, {
            command: 'genshincharacter',
            description: `Gives you the data of the given genshin character.`,
            aliases: ['gchar', 'genshin'],
            category: 'anime',
            usage: `${client.config.prefix}gchar [name]`,
            baseXp: 50
        });
        this.run = (M, { joined }) => __awaiter(this, void 0, void 0, function* () {
            //if (!joined) return void (await M.reply(`You didnt provide any name of the charecter\n if you dont know use these charecter name \n\n albedo \n aloy \n amber \n ayaka \n barbara \n beidou \n bennett \n chongyun \n diluc \n diona \n eula \n fischl \n ganyu \n hu-tao \n jean \n kaeya \n kazuha \n keqing \n klee \n kokomi \n lisa \n mona \n ningguang \n noelle \n qiqi \n raiden \n razor \n rosaria \n sara \n sayu \n sucrose \n tartaglia \n traveler-anemo \n traveler-geo \n venti \n xiangling \n xiao \n xingqiu \n xinyan \n yanfei \n yoimiya \n zhongli \n\n *Example:* Type genshin-charecter amber or gchar amber`))
            const chara = yield axios_1.default.get(`https://api.genshin.dev/characters`);
            if (!joined)
                return void (yield M.reply(`📒 *The searchable characters are:* ${chara.data}`));
            const gchara = joined.trim();
            yield axios_1.default
                .get(`https://api.genshin.dev/characters/${gchara}`)
                .then((response) => {
                const text = `💎 *Name:* ${response.data.name}\n💠 *Vision:* ${response.data.vision}\n📛 *Weapon:* ${response.data.weapon}\n⛩ *Nation:* ${response.data.nation}\n📛 *Affiliation:* ${response.data.affiliation}\n❄ *Constellation:* ${response.data.constellation}\n🎗 *Rarity:* ${response.data.rarity} stars\n🎁 *Birthday:* ${response.data.birthday}\n💚 *Description:* ${response.data.description}\n`;
                M.reply(text);
            })
                .catch((err) => {
                M.reply(`Sorry, couldn't find character *${gchara}*\n🧧 *Use:* ${this.client.config.prefix}gchar to see the full list of searchable characters.\n\n📝 *Note:* Nicknames does not work here.`);
            });
        });
    }
}
exports.default = Command;
