const jwt = require("jsonwebtoken");

function authRequired(req, res, next) {
    try {
        const token = (req.headers.authorization).split(" ")[1];
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = data.id;
        next();
    } catch (err) {
        res.json({error: "Require authentication"});
    }
}

module.exports = authRequired;