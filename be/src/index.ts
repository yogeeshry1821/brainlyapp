import express from "express";
import { random } from "./utils";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";
import cors from "cors";

const app = express();
app.use(express.json()); 
app.use(cors()); 

app.post("/api/v1/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        await UserModel.create({ username, password });
        res.json({ message: "User signed up" }); 
    } catch (e) {
        res.status(409).json({ message: "User already exists" }); 
    }
});

app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Find a user with the provided credentials.
    const existingUser = await UserModel.findOne({ username, password });
    if (existingUser) {
        // Generate a JWT token with the user's ID.
        const token = jwt.sign({ id: existingUser._id }, JWT_SECRET);
        res.json({ token }); // Send the token in response.
    } else {
        // Send error response for invalid credentials.
        res.status(403).json({ message: "Incorrect credentials" });
    }
});

// Route 3: Add Content
app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const { link, type, title } = req.body;
    // Create a new content entry linked to the logged-in user.
    await ContentModel.create({
        link,
        type,
        title,
        userId: req.userId, // userId is added by the middleware.
        tags: [] // Initialize tags as an empty array.
    });

    res.json({ message: "Content added" }); // Send success response.
});

// Route 4: Get User Content
app.get("/api/v1/content", userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;  
    const content = await ContentModel.find({ userId: userId }).populate("userId", "username");
    res.json(content);  
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;
//@ts-ignore
    await ContentModel.deleteMany({ contentId, userId: req.userId });
    res.json({ message: "Deleted" }); 
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    const { share } = req.body;
    if (share) {
        const existingLink = await LinkModel.findOne({ userId: req.userId });
        if (existingLink) {
            res.json({ hash: existingLink.hash }); 
            return;
        }

        const hash = random(10);
        //@ts-ignore
        await LinkModel.create({ userId: req.userId, hash });
        res.json({ hash }); 
    } else {
        //@ts-ignore
        await LinkModel.deleteOne({ userId: req.userId });
        res.json({ message: "Removed link" }); 
    }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({ hash });
    if (!link) {
        res.status(404).json({ message: "Invalid share link" }); 
        return;
    }

    const content = await ContentModel.find({ userId: link.userId });
    const user = await UserModel.findOne({ _id: link.userId });

    if (!user) {
        res.status(404).json({ message: "User not found" }); 
        return;
    }

    res.json({
        username: user.username,
        content
    }); 
});

app.listen(3000, () => console.log("Server is running on port 3000"));

