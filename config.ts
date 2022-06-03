const apiHost = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000/api'
    : 'https://showwcase-challenge.vercel.app/api';
const dbFileHost = 'https://api.jsonbin.io/v3/b/629a2df505f31f68b3b50c4a';
const dbSecretKey = '$2b$10$DsCWm31ZrOcz9TqayjbivOe7YillrqNW9H4QFl08ff6G0RFiHe6ky';
export {
    apiHost,
    dbFileHost,
    dbSecretKey
};