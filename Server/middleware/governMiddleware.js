const HttpError = require("../models/errorModel");

const governMiddleware = (req, res, next) => {
    if (!req.user) {
        return next(new HttpError("Unauthorized. No user found", 401));
    }

    if (req.user.role !== "government") {
        return next(new HttpError("Access denied. Government users only", 403));
    }

    next();
};

module.exports = governMiddleware;