import UserModel from '../../models/user.js';
import FriendsSchema from '../../models/friends.js';

export const addFriend = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.userId;
    const anotherUser = await UserModel.findById(id);
    if (!anotherUser) {
      res.status(401).json({ message: 'Пользователь не найден' });
    }

    const friends = await FriendsSchema.findOne({ user: userId });

    if (!friends) {
      const newFriend = new FriendsSchema({
        user: userId,
        friends: [`${id}`],
      });
      await newFriend.save();

      return res.json({ message: 'пользователь добавлен успешно' });
    }

    const isNotId = friends.friends.filter((friend) => friend === id);
    if (!isNotId.length) {
      await FriendsSchema.updateOne(
        {
          user: userId,
        },
        {
          user: req.userId,
          friends: [...friends.friends, `${id}`],
        },
      );
      return res.json({ success: true });
    }
    return res.json({ success: false });
  } catch (error) {
    res.status(500).json({ message: 'Не удалось добавить пользователя в друзья' });
  }
};
