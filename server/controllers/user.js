const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Users = require("../models/Users");

async function login(req, res) {
    try {
        const {email, pwd, rememberMe} = req.body;
        const errMsg = loginErrorHandler(email, pwd);
        if (!Object.keys(errMsg).length) {
            const user = await Users.checkEmail(email);
            if (user) {
                const isPwdMatch = await bcrypt.compare(pwd, user.pwd);
                if (isPwdMatch) {
                    const token = createToken(user, rememberMe);
                    res.json({token});
                } else {
                    throw new Error("");
                }
            } else {
                throw new Error("");
            }
        } else {
            res.json({error: errMsg});
        }
    } catch (err) {
        res.json({error: {pwd: "Login credentials don't match"}});
    }
}

async function register(req, res) {
    try {
        const {name, email, pwd, confPwd} = req.body;
        const errMsg = await registerErrorHandler(name, email, pwd, confPwd);
        if (!Object.keys(errMsg).length) {
            const salt = await bcrypt.genSalt(12);
            const hashedPwd = await bcrypt.hash(pwd, salt);
            const user = await Users.registerUser(name, email, hashedPwd);
            const token = createToken(user, false);
            res.json({token});
        } else {
            res.json({error: errMsg});
        }
    } catch (err) {
        if (err.errors) {
            const errMsg = Object.keys(err.errors).reduce((accumulator, value) => {
                accumulator[err.errors[value].path] = err.errors[value].message;
                return accumulator;
            }, {});
            res.json({error: errMsg});
        } else {
            res.json({error: {email: "Email has been registered"}});
        }
    }
}

async function findUser(req, res) {
    try {
        const user = await Users.findUser(req.userId);
        if (user) {
            res.json({user: {name: user.name, email: user.email}});
        } else {
            res.json({error: "Can't find user"});
        }
    } catch (err) {
        res.json({error: "Invalid token"});
    }
}

function loginErrorHandler(email, pwd) {
    const errMsg = {};
    if (!email) {
        errMsg.email = "Please enter your email";
    }
    if (!pwd) {
        errMsg.pwd = "Please enter your password";
    }
    return errMsg;
}

async function registerErrorHandler(name, email, pwd, confPwd) {
    const errMsg = {};
    //Name error handler
    if (name) {
        if (name.length > 30) {
            errMsg.name = "Name length exceeds 30 characters";
        }
    } else {
        errMsg.name = "Name is required";
    }
    //Email error handler
    if (email) {
        const isEmailRegistered = await Users.checkEmail(email);
        if (isEmailRegistered) {
            errMsg.email = "Email has been registered";
        } else {
            if (!validator.isEmail(email)) {
                errMsg.email = "Email is not valid";
            }
        }
    } else {
        errMsg.email = "Email is required";
    }
    //Password error handler
    if (pwd) {
        if (pwd.length < 6) {
            errMsg.pwd = "Password must be at least 6 characters";
        } else {
            const isStrongPwd = validator.isStrongPassword(pwd, {
                minLength: 6,
                minLowerCase: 1,
                minUpperCase: 1,
                minNumbers: 1,
                minSymbols: 1
            });
            if (isStrongPwd) {
                if (confPwd) {
                    if (confPwd !== pwd) {
                        errMsg.confPwd = "Password does not match";
                    }
                } else {
                    errMsg.confPwd = "Please confirm your password";
                }
            } else {
                errMsg.pwd = "Password must contain uppercase, lowercase, number, and symbol";
            }
        }
    } else {
        errMsg.pwd = "Password is required";
    }
    return errMsg;
}

function createToken(user, rememberMe) {
    const config = {expiresIn: rememberMe ? "7d" : "1h"};
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, config);
    return token;
}

module.exports = {
    login,
    register,
    findUser
};