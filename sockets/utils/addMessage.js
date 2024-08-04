import UserModel from '../../models/user.js';
import ChatModel from '../../models/chat.js';
import MessagesModel from '../../models/messages.js';

export const addMessage = async (params) => {
  const { message, sendId, chatId, userId } = params;

  const MessagesData = await MessagesModel.findById(chatId);

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
};
