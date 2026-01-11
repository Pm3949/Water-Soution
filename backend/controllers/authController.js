import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginWithPin = async (req, res) => {
  try {
    const { pin } = req.body;

    const users = await User.find();
    const user = users.find((u) => bcrypt.compareSync(pin, u.pinHash));

    if (!user) {
      return res.status(401).json({ message: "Invalid PIN" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1Y" }
    );

    res.json({ token, role: user.role, name: user.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
