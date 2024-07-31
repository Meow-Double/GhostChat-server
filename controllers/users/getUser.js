import UserModel from '../../models/user.js';

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    const userData = {
      name: user.name,
      avatarUrl: user.avatarUrl,
      _id: user._id,
    };
    res.json({ ...userData });
  } catch (error) {
    res.status(500).json({ message: 'Не удалось получить пользователя' });
  }
};
