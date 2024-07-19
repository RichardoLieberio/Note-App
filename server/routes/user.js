const express = require("express");

const authRequired = require("../middlewares/authRequired");
const userContr = require("../controllers/user");

const router = express.Router();

router.get("/", authRequired, userContr.findUser);

router.post("/login", userContr.login);

router.post("/register", userContr.register);

module.exports = router;