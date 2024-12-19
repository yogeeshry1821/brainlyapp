import mongoose,{ model,Schema } from "mongoose";
import dotenv from "dotenv";
import { z } from "zod";

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
const UserSchema= new Schema({
    userName:{type: "string" ,unique : true},
    password: String
}) 
export const UserModel= model("user",UserSchema)