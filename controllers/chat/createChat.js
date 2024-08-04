import UserModel from '../../models/user.js';
import ChatModel from '../../models/chat.js';
import MessagesModel from '../../models/messages.js';

// export const createChats = async (req, res) => {
//   try {
//     const { id } = req.body;
//     const userId = req.userId;

//     const user = await UserModel.findById(id);

//     if (!user) {
//       res.status(401).json({ message: 'пользователь не найден' });
//     }

//     const messagesId = new MessagesModel({});
//     await messagesId.save();

//     const chatsUser = await ChatModel.findOne({ userId });

//     if (!chatsUser) {
//       const myChats = new ChatModel({
//         user: userId,

//         chats: [{ chatId: messagesId._id.toString(), friendId: id }],
//       });
//       myChats.save();
//       const personChats = new ChatModel({
//         user: id,
//         friendId: id,
//         chats: [{ chatId: messagesId._id.toString(), friendId: userId }],
//       });
//       personChats.save();
//     } else {
//       await ChatModel.updateOne(
//         {
//           user: userId,
//         },
//         {
//           user: userId,
//           friendId: id,
//           chats: [...chatsUser.chats, `${messagesId}`],
//         },
//       );
//       await ChatModel.updateOne(
//         {
//           user: id,
//         },
//         {
//           user: id,
//           chats: [...chatsUser.chats, { chatId: `${messagesId}`, friendId: id }],
//           chats: [],
//         },
//       );
//     }
//     return res.json({ success: true, id: messagesId._id });
//   } catch (error) {
//     res.status(500).json({ message: 'Не удалось добавить пользователя в друзья' });
//   }
// };

export const createChats = async (req, res) => {
  try {
    const { id: friendId } = req.body;
    const userId = req.userId;

    const myChats = await ChatModel.findOne({ user: userId });

    // if (!friendChats) {
    //   const friendChat = new ChatModel({
    //     user: friendId,
    //     chats: [
    //       {
    //         friendId: userId,
    //         chatId: messageId && messageId,
    //       },
    //     ],
    //   });
    //   friendChat.save();
    // }

    const checkChatWithFriend = myChats.chats.find((chat) => chat.friendId === friendId);

    if (!checkChatWithFriend) {
      const messageData = new MessagesModel({});
      messageData.save();

      const chatObj = {
        user: userId,
        chats: [
          ...myChats.chats,
          {
            friendId: friendId,
            chatId: messageData._id.toString(),
          },
        ],
      };
      await ChatModel.updateOne(
        {
          user: userId,
        },
        { ...chatObj },
      );

      return res.json(messageData._id.toString());
    }

    // const checkChatWithMe = friendChats.chats.some((chat) => chat.friendId === userId);

    // if (!checkChatWithMe) {
    //   await ChatModel.updateOne(
    //     {
    //       user: friendId,
    //     },
    //     {
    //       user: friendId,
    //       chats: [
    //         ...myChats.chats,
    //         {
    //           friendId: userId,
    //           chatId: '',
    //         },
    //       ],
    //     },
    //   );
    // }

    res.json(checkChatWithFriend.chatId);
  } catch (error) {
    res.status(500).json({ message: 'Не удалось добавить пользователя в друзья' });
  }
};
