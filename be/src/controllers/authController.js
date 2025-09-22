import { sendResetEmail } from "../services/emailService.js";
import User from "../modules/Users.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Missing email" });
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = uuidv4();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  const resetUrl = `http://localhost:${process.env.PORT}/reset-password/${resetToken}`;
  await sendResetEmail({
    to: email,
    name: user.username,
    resetUrl,
    expiresMinutes: 15,
  });

  res.status(200).json({ message: "Password reset email sent" });
}

export async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  if(!token) return res.status(400).json({ message: "Missing token" });
  if(!password) return res.status(400).json({ message: "Missing password" });

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if(!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
}

