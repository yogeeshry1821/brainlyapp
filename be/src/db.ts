import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const { Schema, model } = mongoose;

const mongooseString:any=process.env.MONGOOSE_CONNECTION_STRING;
async function main() {
    try{
        mongoose.connect(mongooseString);
        console.log("connected to mongoDB");
    }
    catch(error){
        console.error(error);
    }
}
main();

const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }
});

export const ContentModel = model("Content", ContentSchema);

const LinkSchema = new Schema({
    hash: String,

    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
});

export const LinkModel = model("Links", LinkSchema);