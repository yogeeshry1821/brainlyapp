import express from "express"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import { z } from "zod";
import dotenv from "dotenv"
import { UserModel } from "./db";
const app=express();
app.use(express.json());
dotenv.config();
const JWT_PASSWORD="123123";
app.post('/api/v1/signup',async(req,res)=>{
    try{
        const { username, password } = req.body;
        console.log('req.body', username,password);
        await UserModel.create({ username, password });
        res.status(201).json({ message: "User created successfully" });
    }
    catch(error){
        if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.issues });
    } else {
      console.error(error);
      res.status(411).json({ message: "User already exists" });
    }
    }
})

app.post("/api/v1/signin", async (req, res) => {
  const username=req.body.username;
  const password=req.body.password;
  console.log('username,password', username,password)
  const existingUser=await UserModel.findOne({username: username, password: password});
    if(existingUser){
        const token=jwt.sign({_id: existingUser._id},JWT_PASSWORD, { expiresIn: "1h" });
        res.json({token});
    }
    else{
        res.status(403).json({ message: "Invalid credentials" });
    }
});
app.delete('/api/v1/content',(req,res)=>{

})
app.get('/api/v1/content',(req,res)=>{

})
app.post('/api/v1/content',(req,res)=>{

})
app.post('/api/v1/brain/share',(req,res)=>{

})
app.post('/api/v1/brain/:shareLink',(req,res)=>{

})

app.listen(3000,()=>console.log("listening on 3000"))