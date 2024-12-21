import mongoose, { model, Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

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
    username: { type: String, unique: true },    password: { type: String }               
});

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
    title: String,                          
    Link: String,                           
    tags: [{ type: mongoose.Types.ObjectId, ref: "tag" }], 
    userId: [{ 
        type: mongoose.Types.ObjectId, 
        ref: "User", 
        required: true
    }],
});

export const ContentModel = model("Content", ContentSchema);

const LinkSchema = new Schema({
    hash: String,

    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
});

export const LinkModel = model("Links", LinkSchema);