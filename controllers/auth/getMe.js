import UserModel from '../../models/user.js';

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const { passwordHash, ...userData } = user._doc;
    return res.json({ ...userData });
  } catch (error) {
    res.status(500).json({ message: 'Не удалось зарегестрироваться' });
  }
};
