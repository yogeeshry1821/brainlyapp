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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv_1.default.config();
const JWT_PASSWORD = "123123";
app.post('/api/v1/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        console.log('req.body', username, password);
        yield db_1.UserModel.create({ username, password });
        res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ errors: error.issues });
        }
        else {
            console.error(error);
            res.status(411).json({ message: "User already exists" });
        }
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    console.log('username,password', username, password);
    const existingUser = yield db_1.UserModel.findOne({ username: username, password: password });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({ _id: existingUser._id }, JWT_PASSWORD);
        res.json({ token });
    }
    else {
        res.status(403).json({ message: "Invalid credentials" });
    }
}));
app.delete('/api/v1/content', (req, res) => {
});
app.get('/api/v1/content', (req, res) => {
});
app.post('/api/v1/content', (req, res) => {
});
app.post('/api/v1/brain/share', (req, res) => {
});
app.post('/api/v1/brain/:shareLink', (req, res) => {
});
app.listen(3000, () => console.log("listening on 3000"));
