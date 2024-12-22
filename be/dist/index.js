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
const utils_1 = require("./utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const signupSchema = zod_1.z.object({
    username: zod_1.z.string().nonempty(),
    password: zod_1.z.string().min(6)
});
const signinSchema = zod_1.z.object({
    username: zod_1.z.string().nonempty(),
    password: zod_1.z.string().min(6)
});
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseResult = signupSchema.safeParse(req.body);
    if (!parseResult.success) {
        res.status(400).json({ message: "Invalid input", errors: parseResult.error.errors });
        return;
    }
    const { username, password } = parseResult.data;
    try {
        const existingUser = yield db_1.UserModel.findOne({ username });
        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10); // Hash the password
        yield db_1.UserModel.create({ username, password: hashedPassword }); // Save hashed password
        res.json({ message: "User signed up" });
    }
    catch (e) {
        console.log('e', e);
        res.status(500).json({ message: "Internal server error" });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseResult = signinSchema.safeParse(req.body);
    if (!parseResult.success) {
        res.status(400).json({ message: "Invalid input", errors: parseResult.error.errors });
        return;
    }
    const { username, password } = parseResult.data;
    const existingUser = yield db_1.UserModel.findOne({ username }); // Find user by username
    if (existingUser) {
        //@ts-ignore
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, existingUser.password); // Compare hashed passwords
        if (isPasswordCorrect) {
            const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, config_1.JWT_PASSWORD);
            res.json({ token });
            return;
        }
    }
    res.status(403).json({ message: "Incorrect credentials" });
}));
// Route 3: Add Content
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title } = req.body;
    // Create a new content entry linked to the logged-in user.
    yield db_1.ContentModel.create({
        link,
        type,
        title,
        userId: req.userId, // userId is added by the middleware.
        tags: [] // Initialize tags as an empty array.
    });
    res.json({ message: "Content added" }); // Send success response.
}));
// Route 4: Get User Content
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const content = yield db_1.ContentModel.find({ userId: userId }).populate("userId", "username");
    res.json(content);
}));
app.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    //@ts-ignore
    yield db_1.ContentModel.deleteMany({ contentId, userId: req.userId });
    res.json({ message: "Deleted" });
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { share } = req.body;
    if (share) {
        const existingLink = yield db_1.LinkModel.findOne({ userId: req.userId });
        if (existingLink) {
            res.json({ hash: existingLink.hash });
            return;
        }
        const hash = (0, utils_1.random)(10);
        //@ts-ignore
        yield db_1.LinkModel.create({ userId: req.userId, hash });
        res.json({ hash });
    }
    else {
        //@ts-ignore
        yield db_1.LinkModel.deleteOne({ userId: req.userId });
        res.json({ message: "Removed link" });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_1.LinkModel.findOne({ hash });
    if (!link) {
        res.status(404).json({ message: "Invalid share link" });
        return;
    }
    const content = yield db_1.ContentModel.find({ userId: link.userId });
    const user = yield db_1.UserModel.findOne({ _id: link.userId });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json({
        username: user.username,
        content
    });
}));
app.listen(3000, () => console.log("Server is running on port 3000"));
