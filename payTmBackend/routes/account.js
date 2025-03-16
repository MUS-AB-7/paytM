const express = require("express");
const mongoose = require("mongoose");
const { Account } = require("../db");
const { authMiddleware } = require("../middleware");

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
})

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;

        const account = await Account.findOne({ userId: req.userId }).session(session).exec();
        if (!account || account.balance < amount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session).exec();
        if (!toAccount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Invalid Account" });
        }

        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }, { session });
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }, { session });

        await session.commitTransaction();
        session.endSession();

        res.json({ message: "Transaction successful" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: "Transaction failed", error: error.message });
    }
});

module.exports = router;
