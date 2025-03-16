const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const signupBody = zod.object({
    email: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
})

router.post('/signup', async (req, res) => {
    const body = req.body;
    const { success } = signupBody.safeParse(body);

    if (!success) {
        return res.status(400).json({
            message: "Invalid inputs"
        })
    }

    const existingUser = await User.findOne({ email: body.email });

    if (existingUser) {
        return res.status(409).json({
            message: "Email already exist"
        })
    }
    const user = await User.create(body);
    const userId = user._id;

    await Account.create({
        userId,
        balance: Math.floor(1000 + Math.random() * 9000)
    })

    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    res.json({
        message: "User Created Successfully",
        token: token
    })
})

const signinBody = zod.object({
    email: zod.string(),
    password: zod.string()
})

router.post("/signin", async (req, res) => {
    const body = req.body;
    const { success } = signinBody.safeParse(body);

    if (!success) {
        return res.status(411).json({
            message: "Incorrect Credentials"
        })
    }

    const user = await User.findOne(body);

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
        return res.json({
            token: token
        })
    }
    res.status(411).json({
        message: "Error while signing in "
    })
})

const updateBody = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const body = req.body;
    const { success } = updateBody.safeParse(body);

    if (!success || Object.keys(body).length === 0) {
        return res.status(411).json({
            message: "Error while updating information"
        });
    }
    const updatedUser = await User.updateOne({ _id: req.userId }, body);

    if (!updatedUser) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json({
        message: "Updated Successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";


    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter, "$options": "i"
            }
        }, {
            lastName: {
                "$regex": filter, "$options": "i"
            }
        }]
    }).limit(10)
    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})
module.exports = router 