const apiHost = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000/api'
    : 'https://showwcase-challenge.vercel.app/api';

export {
    apiHost
};