import express from 'express';

const app = express();

app.get('/users', () => {
    console.log('Users list');
});

export default app;