const express = require("express");
const router = express.Router();
const zod = require("zod");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const signupBody = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
    firstName: zod.string().min(1),
    lastName: zod.string().min(1)
});

const signinBody = zod.object({
    email: zod.string().email(),
    password: zod.string()
});

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
});

router.post("/signup", async (req, res) => {
    try {
        const body = req.body;
        const { success, error } = signupBody.safeParse(body);

        if (!success) return res.status(400).json({ message: "Invalid inputs", error: error.errors });

        const existingUser = await User.findOne({ email: body.email });
        if (existingUser) return res.status(409).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(body.password, 10);
        const user = await User.create({ ...body, password: hashedPassword });

        await Account.create({
            userId: user._id,
            balance: Math.floor(1000 + Math.random() * 9000) 
        });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ message: "User created successfully", token });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.post("/signin", async (req, res) => {
    try {
        const body = req.body;
        const { success } = signinBody.safeParse(body);

        if (!success) return res.status(400).json({ message: "Invalid inputs" });

        const user = await User.findOne({ email: body.email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const match = await bcrypt.compare(body.password, user.password);
        if (!match) return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.put("/", authMiddleware, async (req, res) => {
    try {
        const body = req.body;
        const { success } = updateBody.safeParse(body);

        if (!success || Object.keys(body).length === 0)
            return res.status(400).json({ message: "No valid fields to update" });

        if (body.password) {
            body.password = await bcrypt.hash(body.password, 10); 
        }

        const updatedUser = await User.updateOne({ _id: req.userId }, body);
        if (updatedUser.modifiedCount === 0) return res.status(404).json({ message: "User not found" });

        res.json({ message: "Updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get("/bulk", async (req, res) => {
    try {
        const filter = req.query.filter || "";
        const users = await User.find({
            $or: [
                { firstName: { $regex: filter, $options: "i" } },
                { lastName: { $regex: filter, $options: "i" } }
            ]
        }).limit(10);

        res.json({
            users: users.map(user => ({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
