import UserModel from '../../models/user.js';

export const getUsers = async (req, res) => {
  try {
    const { skip, limit, title } = req.query;

    const limitNumber = limit ? limit : 20;
    const skipNumber = skip ? skip : 0;

    const userId = req.userId;

    const query = title ? { name: new RegExp('^' + title, 'i') } : {};
    const users = await UserModel.find(query).skip(skipNumber).limit(limitNumber);

    if (!users.length) {
      return res.json({ users: [] });
    }

    const idx = users.findIndex((user) => user._id.toJSON() === userId);

    if (idx > -1) {
      delete users[idx];
    }

    const newUsers = users
      .filter((user) => user)
      .map((user) => ({
        name: user.name,
        avatarUrl: user.avatarUrl,
        _id: user._id,
      }));

    return res.json({ users: newUsers });
  } catch (error) {
    res.status(500).json({ message: 'Не удалось получить пользователей' });
  }
};
