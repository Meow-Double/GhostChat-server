import UserModel from '../../models/user.js';
import ChatModel from '../../models/chat.js';
import MessagesModel from '../../models/messages.js';

export const addMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { message, sendId, chatId } = req.body;

    // const MyCahts = await ChatModel.findOne({ user: userId });
    // const friendChats = await ChatModel.findOne({ user: id });

    // const generalChat = MyCahts.chats.filter(
    //   (chatId, index) => chatId.toString() === friendChats.chats[index].toString(),
    // );

    // if (!generalChat.toString()) {
    //   return res.status(401).json({ message: 'Ошибка передачи сообщения' });
    // }

    const MessagesData = await MessagesModel.findById(chatId);
    // console.log(MessagesData)
    if (!MessagesData.messages.length) {
      const myData = await ChatModel.findOne({ user: userId });

      const friendObject = myData.chats.find((chat) => chat.chatId === chatId);

      const friendChats = await ChatModel.findOne({ user: friendObject.friendId });
      const checkChatWithMe = friendChats.chats.some((chat) => chat.friendId === userId);

      if (!checkChatWithMe) {
        const chatObj = {
          user: friendObject.friendId,
          chats: [
            ...friendChats.chats,
            {
              friendId: userId,
              chatId: MessagesData._id.toString(),
            },
          ],
        };
        await ChatModel.updateOne(
          {
            user: friendObject.friendId,
          },
          { ...chatObj },
        );
      }
    }

    await MessagesModel.updateOne(
      { _id: chatId },
      {
        messages: [...MessagesData.messages, { sendId, message }],
      },
    );

    res.json({ sendId, message });
  } catch (error) {
    res.status(500).json({ message: 'Не удалось отправить сообщение' });
  }
};
