const jwt = require("jsonwebtoken");
const config = require("../config/config");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt_token;
    //check jwt exists & its verified
    if (token) {
        jwt.verify(token, config.secret_jwt, (err, decodedToken) => {
            if (err) {
                console.log("error in verify token(login first) : " + err.message);
                res.status(400).send({ success: false, msg: "Login First" });
            }
            else {
                console.log(decodedToken);
                next();
            }
        });
    }
    else {
        console.log("Login first");
        res.status(400).send({ success: false, msg: "Login First" });
    }
}

module.exports = {
    requireAuth
}