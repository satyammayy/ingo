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
                return void M.reply('🔎 Provide a element symbol');
            const term = joined.trim();
            yield axios_1.default
                .get(`https://neelpatel05.pythonanywhere.com/element/symbol?symbol=${term}`)
                .then((response) => {
                // console.log(response);
                const text = `Information of the element *${term}* is \n 🧪 *Name:* ${response.data.name} \n ⚛️ *Symbol:* ${response.data.symbol} \n 📍 *Atomic Number:* ${response.data.atomicNumber} \n 🧫 *Atomic Mass:* ${response.data.atomicMass} \n 🎯 *Atomic Radius:* ${response.data.atomicRadius} \n 🖇 *Bonding type:* ${response.data.bondingType} \n ⚗ *Density:* ${response.data.density} \n 🗃 *Group Block:* ${response.data.groupBlock} \n 🔎 *State:* ${response.data.standardState}`;
                M.reply(text);
            })
                .catch((err) => {
                M.reply(`🔍 Please provide a valid place name \n Error: ${err}`);
            });
        });
    }
}
exports.default = Command;
