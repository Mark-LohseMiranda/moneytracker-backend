const express = require("express");
const router = express.Router();

const transactionRoutes = require("./transactionController");
router.use("/transaction", transactionRoutes);

const userRoutes = require("./userController");
router.use("/user", userRoutes);

module.exports = router;