import UserModel from '../../models/user.js';
import ChatModel from '../../models/chat.js';
import MessagesModel from '../../models/messages.js';
import chat from '../../models/chat.js';

export const getChats = async (req, res) => {
  try {
    const userId = req.userId;
    // const users = await UserModel.find({});

    const myChatData = await ChatModel.findOne({ user: userId });
    const myChats = myChatData.chats;

    const userDataPromise = myChats.map(async (chat) => {
      const user = await UserModel.findById(chat.friendId);
      const userObj = {
        name: user.name,
        avatarUrl: user.avatarUrl,
        chatId: chat.chatId,
      };
      return userObj;
    });

    const userData = await Promise.all(userDataPromise)
      .then((results) => {
        return results;
      })
      .catch((error) => {
        console.error('Ошибка при выполнении промисов:', error);
      });

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Не удалось получить список чатов' });
  }
};
