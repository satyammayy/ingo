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
            command: 'elements',
            description: 'get the info of the chemical element',
            aliases: ['element'],
            category: 'educative',
            usage: `${client.config.prefix}element [name]`
        });
        this.run = (M, { joined }) => __awaiter(this, void 0, void 0, function* () {
            if (!joined)
                return void M.reply('๐ Provide a element symbol');
            const term = joined.trim();
            yield axios_1.default
                .get(`https://neelpatel05.pythonanywhere.com/element/symbol?symbol=${term}`)
                .then((response) => {
                // console.log(response);
                const text = `Information of the element *${term}* is \n ๐งช *Name:* ${response.data.name} \n โ๏ธ *Symbol:* ${response.data.symbol} \n ๐ *Atomic Number:* ${response.data.atomicNumber} \n ๐งซ *Atomic Mass:* ${response.data.atomicMass} \n ๐ฏ *Atomic Radius:* ${response.data.atomicRadius} \n ๐ *Bonding type:* ${response.data.bondingType} \n โ *Density:* ${response.data.density} \n ๐ *Group Block:* ${response.data.groupBlock} \n ๐ *State:* ${response.data.standardState}`;
                M.reply(text);
            })
                .catch((err) => {
                M.reply(`๐ Please provide a valid place name \n Error: ${err}`);
            });
        });
    }
}
exports.default = Command;
