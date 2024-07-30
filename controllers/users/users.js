import UserModel from '../../models/user.js';

export const getUsers = async (req, res) => {
  try {
    const { skip, limit } = req.query;

    const limitNumber = limit ? limit : 20;
    const skipNumber = skip ? skip : 0;

    const userId = req.userId;
    const users = await UserModel.find({}).skip(skipNumber).limit(limitNumber);

    const idx = users.findIndex((user) => user._id.toJSON() === userId);
    if (idx) {
      delete users[idx];
    }

    const newUsers = users
      .filter((user) => user)
      .map((user) => ({
        name: user.name,
        avatarUrl: user.avatarUrl,
        _id: user._id,
      }));

    res.json({ users: newUsers });
  } catch (error) {
    res.status(500).json({ message: 'Не удалось получить пользователей' });
  }
};
