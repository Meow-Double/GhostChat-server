import { SERVER_URL } from '../configs.js';

export const getRandomAvatarka = () => {
  const randomValue = getRandomNumber(1, 10);
  const iamgeUrl = `${SERVER_URL}/uploads/randomAvatarka/img${randomValue}.jpg`;
  return iamgeUrl;
};

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
