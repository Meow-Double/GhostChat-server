import bcrypt from 'bcrypt';
import UserModel from '../../models/user.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    const isValidPSW = await bcrypt.compare(password, user._doc.passwordHash);

    if (!isValidPSW) {
      return res.status(403).json({ messages: 'Не верный логин или пароль' });
    }

    const token = jwt.sign(
      {
        email,
        _id: user._id,
      },
      process.env.AUTH_SECRET_KEY,
      { expiresIn: '30d' },
    );

    const { passwordHash, ...userData } = user._doc;

    return res.json({ ...userData, token });
  } catch (error) {
    res.status(500).json({ message: 'Не удалось авторизоваться' });
  }
};
