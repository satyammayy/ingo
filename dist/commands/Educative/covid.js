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
            command: 'covid',
            description: 'get the covid-19 info of the current place',
            aliases: ['COVID'],
            category: 'educative',
            usage: `${client.config.prefix}covid [name]`
        });
        this.run = (M, { joined }) => __awaiter(this, void 0, void 0, function* () {
            if (!joined)
                return void M.reply('๐ Provide a place name');
            const term = joined.trim();
            yield axios_1.default.get(`https://api.abirhasan.wtf/covid19/v1?country=${term}`)
                .then((response) => {
                // console.log(response);
                const text = `๐ฆ  Covid Information of the place *${term}* is \n\n ๐งช *TotalTests:* ${response.data.TotalTests} \n ๐ *ActiveCases:* ${response.data.ActiveCases} \n ๐ฅ *Confirmed:* ${response.data.Confirmed} \n ๐ณ *Critical:* ${response.data.Critical} \n โ *Recovered:* ${response.data.Recovered} \n ๐งซ *NewCases:* ${response.data.NewCases} \n ๐ *NewDeaths:* ${response.data.NewDeaths} \n โ *TotalCases:* ${response.data.TotalCases} \n ๐ฉ *Country:* ${response.data.Country} `;
                M.reply(text);
            })
                .catch(err => {
                M.reply(`๐ Please provide a valid place name \n Error: ${err}`);
            });
        });
    }
}
exports.default = Command;
