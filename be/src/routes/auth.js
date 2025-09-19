import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../modules/Users.js";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const JWT_EXPIRES_IN = "15m";

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  (!username || !password) &&
    res.status(400).json({ message: "Missing username or password" });
  const existingUser = await User.findOne({ username });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashedPassword });
  res.status(201).json({ user });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Missing username or password" });

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  } else if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const payload = { userId: user._id, role: user.role };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: "1d",
  });

  user.refreshToken.push(refreshToken);
  await user.save();

  res.status(200).json({ user, accessToken, refreshToken });
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await User.findById(payload.userId);
    if (!user || !user.refreshToken.includes(refreshToken))
      return res.status(403).json({ message: "Invalid or expired token" });

    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
});

router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });
  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET);

    const user = await User.findById(payload.userId);
    if (!user || !user.refreshToken.includes(refreshToken))
      return res.status(403).json({ message: "Invalid or expired token" });

    user.refreshToken = user.refreshToken.filter(token => token !== refreshToken)
    await user.save();
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
})

export default router;
