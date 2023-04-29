const { resError } = require("../services/responseHandler");
const crypto = require("crypto");
const { setCookie } = require("../services/auth");
const identifier = (req, res, next) => {
    try {
        if (!req.cookies?.Identifier) {
            const oneYearFromNow = new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
            );
            setCookie({
                res,
                title: "Identifier",
                data: crypto.randomUUID(),
                maxAge: oneYearFromNow,
            });
        }
        return next();
    } catch (error) {
        resError({ res, title: "Failed To Identify User" });
    }
};

module.exports = { identifier };
