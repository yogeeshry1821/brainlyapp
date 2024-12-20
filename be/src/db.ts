import mongoose,{ model,Schema } from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
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
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
export const UserModel= mongoose.model("User", UserSchema);