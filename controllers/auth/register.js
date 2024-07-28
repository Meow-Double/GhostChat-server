import bcrypt from 'bcrypt';
import UserModel from '../../models/user.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { password, ...data } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      ...data,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        email: data.email,
        id: user._id,
      },
      process.env.AUTH_SECRET_KEY,
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;
    return res.json({ ...userData, token });
  } catch (error) {
    res.status(500).json({ messages: 'Не удалось зарегестрироваться' });
  }
};
