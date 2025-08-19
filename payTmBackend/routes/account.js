const express = require("express");
const mongoose = require("mongoose");
const { Account } = require("../db");
const { authMiddleware } = require("../middleware");

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });
        if (!account) return res.status(404).json({ message: "Account not found" });

        res.json({ balance: account.balance });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.post("/deposit", authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid deposit amount" });

        const account = await Account.findOneAndUpdate(
            { userId: req.userId },
            { $inc: { balance: amount } },
            { new: true }
        );

        if (!account) return res.status(404).json({ message: "Account not found" });

        res.json({ message: "Deposit successful", balance: account.balance });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.post("/transfer", authMiddleware, async (req, res) => {
    try {
        const { amount, to } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid transfer amount" });
        }

        if (to === req.userId) {
            return res.status(400).json({ message: "Cannot transfer to yourself" });
        }

        if (!mongoose.Types.ObjectId.isValid(to)) {
            return res.status(400).json({ message: "Invalid recipient account" });
        }

        const senderAccount = await Account.findOne({ userId: req.userId });
        if (!senderAccount || senderAccount.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const receiverAccount = await Account.findOne({ userId: to });
        if (!receiverAccount) {
            return res.status(404).json({ message: "Recipient account not found" });
        }

        // Update balances
        senderAccount.balance -= amount;
        receiverAccount.balance += amount;

        await senderAccount.save();
        await receiverAccount.save();

        res.json({ message: "Transfer successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Transaction failed", error: err.message });
    }
});


module.exports = router;
