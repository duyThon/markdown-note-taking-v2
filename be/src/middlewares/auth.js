import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token" });
        req.user = { userId: user.userId, role: user.role };
        next();
    });
}

export const authorizeRole = (role) => {
    return (req, res, next) => {
        if(!role.includes(req.user.role)) return res.status(403).json({ message: "Forbidden: insufficient rights" });
        next();
    }
}

