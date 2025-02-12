const express = require("express");
const { createReferral } = require("../controllers/referralController");

const router = express.Router();

router.post("/referral", createReferral);

module.exports = router;
