import MessagesModel from '../../models/messages.js';

export const getMessages = async (req, res) => {
  const { id: chatId } = req.params;

  const messages = await MessagesModel.findById(chatId);
  const messageData = messages.messages ?? [];
  res.json(messageData);
  try {
  } catch (error) {
    res.status(500).json({ message: 'Не удалось получить чат' });
  }
};
