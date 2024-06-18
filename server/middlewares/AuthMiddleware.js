const { verify } = require('jsonwebtoken');

const validateToken = (roles = []) => (req, res, next) => {
    const authorizationHeader = req.header("Authorization");
    if (!authorizationHeader) {
        return res.status(401).json({ error: "User not logged in" });
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
        return res.status(401).json({ error: "User not logged in" });
    }

    try {
        const validToken = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = validToken;

        if (roles.length && !roles.includes(validToken.role)) {
            return res.status(403).json({ error: "User not authorized" });
        }

        return next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = { validateToken };
