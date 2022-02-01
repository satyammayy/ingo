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
            command: 'ip',
            description: `Gives you info about IP Address`,
            aliases: ['ipa', 'ip', 'ipaddress'],
            category: 'educative',
            usage: `${client.config.prefix}ip [name]`,
            baseXp: 50
        });
        this.run = (M, { joined }) => __awaiter(this, void 0, void 0, function* () {
            if (!joined)
                return void (yield M.reply(`Please provide the IP Address`));
            const pypi = joined.trim();
            yield axios_1.default
                .get(`http://ip-api.com/json/${pypi}`)
                .then((response) => {
                if (response.data.status === "fail")
                    return void M.reply("Invalid IP Address / Query");
                const text = `Status : ${response.data.status} \n IP : ${response.data.query} \n ISP : ${response.data.isp} \n Organisation : ${response.data.org} \n Country : ${response.data.country} \n Region : ${response.data.regionName} \n City : ${response.data.country} `;
                M.reply(text);
            })
                .catch((err) => {
                M.reply(`Sorry, error.`);
            });
        });
    }
}
exports.default = Command;
