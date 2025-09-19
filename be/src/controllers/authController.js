import { sendMail } from "../services/emailService";
import User from "../modules/Users";
import { v4 as uuidv4 } from "uuid";

export async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Missing email" });
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = uuidv4();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  const resetUrl = `https://localhost:${process.env.FE_PORT}/reset-password/${resetToken}`;
  await sendResetEmail({
    to: email,
    name: user.name || user.username,
    resetUrl,
    expiresMinutes: 15,
  });

  res.status(200).json({ message: "Password reset email sent" });
}
