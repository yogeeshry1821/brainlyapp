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
exports.LinkModel = exports.ContentModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { Schema, model } = mongoose_1.default;
const mongooseString = process.env.MONGOOSE_CONNECTION_STRING;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            mongoose_1.default.connect(mongooseString);
            console.log("connected to mongoDB");
        }
        catch (error) {
            console.error(error);
        }
    });
}
main();
const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
exports.UserModel = model("User", UserSchema);
const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: "Tag" }],
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: true
    }
});
exports.ContentModel = model("Content", ContentSchema);
const LinkSchema = new Schema({
    hash: String,
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true, unique: true },
});
exports.LinkModel = model("Links", LinkSchema);
